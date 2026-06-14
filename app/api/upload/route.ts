import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { getCurrentUser } from "@/lib/auth/session";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 10 * 1024 * 1024;
const FREEIMAGE_ENDPOINT = "https://freeimage.host/api/1/upload";

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.FREEIMAGE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: "Image upload is not configured" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ message: "Unsupported file type" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ message: "File too large (max 10MB)" }, { status: 400 });
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());

    const compressed = await sharp(inputBuffer)
      .rotate()
      .resize({ width: 1280, height: 1280, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 72, mozjpeg: true })
      .toBuffer();

    const body = new URLSearchParams();
    body.set("key", apiKey);
    body.set("source", compressed.toString("base64"));
    body.set("format", "json");

    const uploadRes = await fetch(FREEIMAGE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const data = await uploadRes.json();

    if (!uploadRes.ok || data.status_code !== 200 || !data.image?.url) {
      console.error("[upload] freeimage.host error", data);
      return NextResponse.json({ message: "Image host upload failed" }, { status: 502 });
    }

    return NextResponse.json({ url: data.image.url }, { status: 201 });
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
