import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth/jwt";

export default async function FeedPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) redirect("/login");

  const payload = verifyToken(token);
  if (!payload) redirect("/login");

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-poppins), sans-serif",
        background: "var(--bg1, #f5f5f5)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          Welcome, {payload.firstName} {payload.lastName}!
        </h1>
        <p style={{ color: "#767676", marginBottom: "2rem" }}>
          Feed page coming soon.
        </p>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            style={{
              background: "#1890FF",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "10px 28px",
              fontSize: "14px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Logout
          </button>
        </form>
      </div>
    </main>
  );
}
