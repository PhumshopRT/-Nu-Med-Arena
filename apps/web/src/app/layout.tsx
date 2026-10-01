import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NuMedArena — Mode 1: Localization Match",
  description: "เกมไพ่การศึกษาแพทย์นิวเคลียร์ เรียนรู้กลไกการสะสมสารเภสัชรังสีแบบเรียลไทม์",
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
