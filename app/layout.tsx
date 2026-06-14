import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { poppins } from "@/lib/assets/fonts";
import "./globals.css";
import "../lib/styles/bootstrap.min.css";
import "../lib/styles/fonts.css";
import "../lib/styles/common.css";
import "../lib/styles/main.css";
import "../lib/styles/responsive.css";

export const metadata: Metadata = {
  title: "Buddy Script",
  description: "Social feed application",
  icons: {
    icon: "/images/logo-copy.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: "var(--font-poppins), sans-serif", fontSize: "14px" },
            success: { iconTheme: { primary: "#0ACF83", secondary: "#fff" } },
            error:   { iconTheme: { primary: "#FF4D4F", secondary: "#fff" } },
          }}
        />
      </body>
    </html>
  );
}
