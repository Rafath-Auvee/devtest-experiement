import Image from "next/image";
import { images } from "@/lib/assets/images";

interface GoogleButtonProps {
  label: string;
  wrapperClass?: string;
}

export default function GoogleButton({
  label,
  wrapperClass = "_social_login_content_btn _mar_b40",
}: GoogleButtonProps) {
  return (
    <a href="/api/auth/google" className={wrapperClass} style={{ textDecoration: "none", whiteSpace: "nowrap" }}>
      <Image src={images.google} alt="Google" width={20} height={20} className="_google_img" />
      <span>{label}</span>
    </a>
  );
}

