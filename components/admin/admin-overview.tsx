import { formatDateLabel } from "@/lib/formatters";
import type { Department, DepartmentRelation, ScrapeJob } from "@/lib/types";

const REFERENCE_NOW = new Date("2026-04-10T00:00:00+09:00").getTime();
const STALE_THRESHOLD_MS = 1000 * 60 * 60 * 24 * 45;

type AdminOverviewProps = {
  departments: Department[];
  relations: DepartmentRelation[];
  scrapeJobs: ScrapeJob[];
};

export function AdminOverview({
  departments,
  relations,
  scrapeJobs,
}: AdminOverviewProps) {
  const staleDepartments = departments.filter((department) => {
    const updatedAt = new Date(department.updatedAt).getTime();
    return REFERENCE_NOW - updatedAt > STALE_THRESHOLD_MS;
  });
  const protectedAdmin = Boolean(process.env.ADMIN_EMAILS);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <section className="grid gap-4">
        <MetricTile label="窓口データ" value={`${departments.length}件`} hint="department スキーマ相当" />
        <MetricTile label="リレーション" value={`${relations.length}本`} hint="手動補完対象を含む" />
        <MetricTile
          label="管理認証"
          value={protectedAdmin ? "設定済み" : "未接続"}
          hint={protectedAdmin ? "ADMIN_EMAILS 確認済み" : "Clerk / Auth.js 接続待ち"}
        />
      </section>

      <section className="grid gap-6">
        <article className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-[0_18px_60px_rgba(55,60,80,0.08)]">
          <h2 className="font-[family:var(--font-heading)] text-2xl font-bold text-slate-950">
            スクレイピング実行状況
          </h2>
          <div className="mt-5 grid gap-3">
            {scrapeJobs.map((job) => (
              <div key={job.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{job.resultSummary}</p>
                    <p className="mt-1 text-sm text-slate-600">{job.targetUrl}</p>
                  </div>
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                    {job.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  開始 {formatDateLabel(job.startedAt)} / 終了 {formatDateLabel(job.finishedAt)}
                </p>
                {job.errorMessage ? (
                  <p className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {job.errorMessage}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-[0_18px_60px_rgba(55,60,80,0.08)]">
          <h2 className="font-[family:var(--font-heading)] text-2xl font-bold text-slate-950">
            人手で補完したい項目
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <ChecklistCard title="関係性" items={["業務連携の重み付け", "誤問い合わせの線引き", "カテゴリ横断の導線"]} />
            <ChecklistCard title="説明文" items={["学生向けの言い換え", "問い合わせるべき場面", "注意事項の優先順位"]} />
            <ChecklistCard title="公開制御" items={["情報のみフラグ", "非公開下書き", "履歴表示"]} />
            <ChecklistCard title="認証" items={["管理者ログイン", "Mutation保護", "監査ログ"]} />
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-[0_18px_60px_rgba(55,60,80,0.08)]">
          <h2 className="font-[family:var(--font-heading)] text-2xl font-bold text-slate-950">
            更新が古い窓口
          </h2>
          <div className="mt-5 grid gap-3">
            {staleDepartments.map((department) => (
              <div key={department.id} className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-950">{department.name}</p>
                <p className="mt-1">最終更新 {formatDateLabel(department.updatedAt)}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

function MetricTile({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-[1.75rem] border border-white/60 bg-white/85 p-5 shadow-[0_18px_50px_rgba(55,60,80,0.08)]">
      <p className="text-sm uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{hint}</p>
    </div>
  );
}

function ChecklistCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="font-semibold text-slate-950">{title}</p>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
