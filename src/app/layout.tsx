import  Link  from "next/link";
import "./globals.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'chapter8',
  description: 'NextJS BlogSite',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <header className="flex items-center bg-gray-900 text-white font-bold justify-between p-6">
          <Link href="/" className="text-white">Blog</Link>
          <Link href="/contact" className="text-white">お問い合わせ</Link>
        </header>
        { children }
      </body>
    </html>
  );
}