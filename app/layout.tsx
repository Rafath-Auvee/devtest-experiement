import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import "../lib/styles/bootstrap.min.css";
import "../lib/styles/fonts.css";
import "../lib/styles/common.css";
import "../lib/styles/main.css";
import "../lib/styles/responsive.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
});

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
    <html lang="en" className={poppins.variable}>
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
