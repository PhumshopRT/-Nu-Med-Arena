import type { Metadata, Viewport } from "next";
import { getAssetPath } from "@/lib/assets";
import "./globals.css";

export const metadata: Metadata = {
  title: "NuMedArena — Mode 1: Localization Match",
  description: "เกมไพ่การศึกษาแพทย์นิวเคลียร์ เรียนรู้กลไกการสะสมสารเภสัชรังสีแบบเรียลไทม์",
  applicationName: "NuMedArena",
  manifest: getAssetPath("/manifest.webmanifest"),
  icons: {
    icon: [
      { url: getAssetPath("/icons/favicon.ico"), sizes: "any" },
      { url: getAssetPath("/icons/favicon-32.png"), sizes: "32x32", type: "image/png" },
      { url: getAssetPath("/icons/favicon-16.png"), sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: getAssetPath("/icons/apple-touch-icon.png"), sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "NuMedArena",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#071B36",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased min-h-screen bg-felt-deep text-white">
        {children}
      </body>
    </html>
  );
}
