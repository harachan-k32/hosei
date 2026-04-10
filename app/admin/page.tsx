import { AdminOverview } from "@/components/admin/admin-overview";
import { departments, relations, scrapeJobs } from "@/lib/data";

export const metadata = {
  title: "管理画面",
};

export default function AdminPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-white/60 bg-slate-950 p-8 text-slate-50 shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
        <p className="text-sm uppercase tracking-[0.22em] text-amber-200">Admin Console</p>
        <h1 className="mt-3 font-[family:var(--font-heading)] text-4xl font-bold tracking-tight text-white">
          取込状況と手動補完ポイントを一画面で確認
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
          本来は認証保護された管理画面として、スクレイピングの再実行、公開状態切替、リレーション編集を行う想定です。
          このデモでは、公開アプリから切り離された運用情報の見え方を先に固めています。
        </p>
      </section>

      <AdminOverview departments={departments} relations={relations} scrapeJobs={scrapeJobs} />
    </main>
  );
}
