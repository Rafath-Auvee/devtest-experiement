import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "../src/styles/bootstrap.min.css";
import "../src/styles/fonts.css";
import "../src/styles/common.css";
import "../src/styles/main.css";
import "../src/styles/responsive.css";

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
      <body>{children}</body>
    </html>
  );
}
