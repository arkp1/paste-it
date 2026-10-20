import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paste it — simple text sharing",
  description: "Create a private, shareable text paste in seconds."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
