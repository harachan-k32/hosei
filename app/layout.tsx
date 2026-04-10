import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://hosei-department-map.vercel.app",
  ),
  title: {
    default: "法政大学 問い合わせ先マップ",
    template: "%s | 法政大学 問い合わせ先マップ",
  },
  description:
    "法政大学の問い合わせ先を検索・比較し、関連する窓口まで地図のようにたどれる案内アプリ。",
  openGraph: {
    title: "法政大学 問い合わせ先マップ",
    description:
      "問い合わせ先、対応シーン、関連窓口をひとつの画面で確認できるディレクトリ。",
    type: "website",
    images: ["/api/og"],
  },
  twitter: {
    card: "summary_large_image",
    title: "法政大学 問い合わせ先マップ",
    description:
      "検索・フィルタ・関係マップで、必要な窓口へ最短で到達できるディレクトリ。",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <div className="relative flex min-h-full flex-col">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[26rem] bg-[radial-gradient(circle_at_top,_rgba(246,201,93,0.28),_transparent_55%),linear-gradient(180deg,_rgba(255,249,239,0.95),_rgba(244,247,252,0.95))]" />
          <header className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-4 pt-6 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3 text-slate-950">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white shadow-lg shadow-amber-200/40">
                HD
              </span>
              <span className="font-[family:var(--font-heading)] text-lg font-bold tracking-tight">
                法政大学 問い合わせ先マップ
              </span>
            </Link>
            <nav className="flex items-center gap-2 text-sm text-slate-700">
              <Link className="rounded-full px-4 py-2 transition hover:bg-white/70" href="/">
                一覧
              </Link>
              <Link
                className="rounded-full px-4 py-2 transition hover:bg-white/70"
                href="/map"
              >
                マップ
              </Link>
              <Link
                className="rounded-full px-4 py-2 transition hover:bg-white/70"
                href="/admin"
              >
                管理
              </Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
