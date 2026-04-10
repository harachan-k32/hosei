import { DirectoryShell } from "@/components/departments/directory-shell";
import { categories, departments, relations, scrapeJobs } from "@/lib/data";
import { getLatestUpdateLabel } from "@/lib/formatters";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 rounded-[2rem] border border-white/60 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.9),_rgba(252,243,224,0.92)_45%,_rgba(237,241,255,0.92)_100%)] p-8 shadow-[0_24px_80px_rgba(55,60,80,0.08)] lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-5">
          <p className="w-fit rounded-full border border-slate-300/70 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            Hosei Contact Guide
          </p>
          <div className="space-y-3">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              迷ったら、法政大学の問い合わせ先を地図からたどれるディレクトリ。
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
              課の役割、よくある相談内容、関連する窓口をひとつの画面にまとめました。検索と複数フィルタで
              絞り込みながら、関連マップで「次に見るべき窓口」まで把握できます。
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-slate-950 px-4 py-2 font-medium text-white">
              3クリック以内で詳細へ
            </span>
            <span className="rounded-full border border-slate-300 bg-white/80 px-4 py-2">
              最終更新 {getLatestUpdateLabel(departments)}
            </span>
            <span className="rounded-full border border-slate-300 bg-white/80 px-4 py-2">
              公開URLで共有可能
            </span>
          </div>
        </div>
        <aside className="grid gap-3 rounded-[1.75rem] bg-slate-950 p-6 text-slate-50 shadow-[0_20px_60px_rgba(15,23,42,0.24)]">
          <p className="text-sm uppercase tracking-[0.22em] text-amber-200">
            MVP Scope
          </p>
          <div className="grid gap-3 text-sm text-slate-200">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">一覧 + 検索 + フィルタ</p>
              <p className="mt-1 leading-6 text-slate-300">
                課名、カテゴリ、対象者、問い合わせ例まで横断検索。
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">関係マップ</p>
              <p className="mt-1 leading-6 text-slate-300">
                業務連携、誤問い合わせ、導線の近さを色分けして可視化。
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">共有しやすい詳細ページ</p>
              <p className="mt-1 leading-6 text-slate-300">
                受付情報と注意点をURL単位で渡せる構成です。
              </p>
            </div>
          </div>
        </aside>
      </section>

      <DirectoryShell
        categories={categories}
        departments={departments}
        relations={relations}
        scrapeJobs={scrapeJobs}
      />
    </main>
  );
}
