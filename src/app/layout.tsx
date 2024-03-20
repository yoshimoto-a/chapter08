import "./globals.css";
import type { Metadata } from "next";
import { Header } from "./_components/Header";

export const metadata: Metadata = {
  title: "chapter8",
  description: "NextJS BlogSite",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Header></Header>
        {children}
      </body>
    </html>
  );
}
