import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareActions } from "@/components/departments/share-actions";
import { Badge } from "@/components/ui/badge";
import { departments, getCategoryById, getDepartmentBySlug, relations } from "@/lib/data";
import { formatDateLabel } from "@/lib/formatters";

type DepartmentPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return departments.map((department) => ({
    slug: department.slug,
  }));
}

export async function generateMetadata({ params }: DepartmentPageProps) {
  const { slug } = await params;
  const department = getDepartmentBySlug(slug);

  if (!department) {
    return {};
  }

  return {
    title: department.name,
    description: department.shortDescription,
    openGraph: {
      images: [`/api/og?slug=${department.slug}`],
    },
    twitter: {
      images: [`/api/og?slug=${department.slug}`],
    },
  };
}

export default async function DepartmentPage({ params }: DepartmentPageProps) {
  const { slug } = await params;
  const department = getDepartmentBySlug(slug);

  if (!department) {
    notFound();
  }

  const category = getCategoryById(department.categoryId);
  const relatedDepartments = department.relatedSlugs
    .map((relatedSlug) => getDepartmentBySlug(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => item !== undefined);
  const relatedRelations = relations.filter(
    (relation) =>
      relation.fromDepartmentId === department.id || relation.toDepartmentId === department.id,
  );

  return (
    <main className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-[0_24px_80px_rgba(55,60,80,0.08)]">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <Link href="/" className="rounded-full border border-slate-300 px-4 py-2 hover:bg-slate-50">
            一覧へ戻る
          </Link>
          <Badge variant="category">{category?.name ?? "未分類"}</Badge>
          <Badge variant="neutral">{department.status === "active" ? "受付中" : "情報のみ"}</Badge>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Department Detail</p>
              <h1 className="font-[family:var(--font-heading)] text-4xl font-bold tracking-tight text-slate-950">
                {department.name}
              </h1>
              <p className="text-lg text-slate-600">{department.officialName}</p>
              <p className="max-w-3xl text-base leading-8 text-slate-700">{department.longDescription}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {department.campusTypes.map((campus) => (
                <Badge key={campus} variant="campus">
                  {campus}
                </Badge>
              ))}
              {department.courseTypes.map((course) => (
                <Badge key={course} variant="course">
                  {course}
                </Badge>
              ))}
              {department.audienceTypes.map((audience) => (
                <Badge key={audience} variant="neutral">
                  {audience}
                </Badge>
              ))}
            </div>
          </div>
          <div className="rounded-[1.75rem] bg-slate-950 p-6 text-slate-50 shadow-[0_20px_60px_rgba(15,23,42,0.24)]">
            <p className="text-sm uppercase tracking-[0.2em] text-amber-200">共有と更新</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              問い合わせるべきケースや注意点をそのまま第三者に共有できるよう、詳細ページ単位でURLを発行しています。
            </p>
            <dl className="mt-5 grid gap-3 text-sm text-slate-200">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <dt className="text-slate-400">最終更新</dt>
                <dd className="mt-1 text-base font-semibold text-white">
                  {formatDateLabel(department.updatedAt)}
                </dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <dt className="text-slate-400">最終スクレイプ</dt>
                <dd className="mt-1 text-base font-semibold text-white">
                  {formatDateLabel(department.lastScrapedAt)}
                </dd>
              </div>
            </dl>
            <div className="mt-5">
              <ShareActions slug={department.slug} name={department.name} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-[0_18px_60px_rgba(55,60,80,0.08)]">
          <h2 className="font-[family:var(--font-heading)] text-2xl font-bold text-slate-950">
            どういうときに問い合わせるか
          </h2>
          <ul className="mt-5 grid gap-3 text-sm leading-7 text-slate-700">
            {department.inquiryExamples.map((example) => (
              <li key={example} className="rounded-2xl bg-slate-50 px-4 py-3">
                {example}
              </li>
            ))}
          </ul>

          <h2 className="mt-8 font-[family:var(--font-heading)] text-2xl font-bold text-slate-950">
            注意事項
          </h2>
          <ul className="mt-5 grid gap-3 text-sm leading-7 text-slate-700">
            {department.cautionNotes.map((note) => (
              <li key={note} className="rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3">
                {note}
              </li>
            ))}
          </ul>
        </article>

        <aside className="grid gap-6">
          <section className="rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-[0_18px_60px_rgba(55,60,80,0.08)]">
            <h2 className="font-[family:var(--font-heading)] text-2xl font-bold text-slate-950">
              受付情報
            </h2>
            <dl className="mt-5 grid gap-4 text-sm text-slate-700">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <dt className="text-slate-500">電話番号</dt>
                <dd className="mt-1 font-semibold text-slate-950">{department.phone}</dd>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <dt className="text-slate-500">メール</dt>
                <dd className="mt-1 font-semibold text-slate-950">{department.email}</dd>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <dt className="text-slate-500">受付時間</dt>
                <dd className="mt-1 font-semibold text-slate-950">{department.officeHours}</dd>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <dt className="text-slate-500">公式リンク</dt>
                <dd className="mt-1 font-semibold text-slate-950">
                  <a
                    className="text-amber-700 underline decoration-amber-300 underline-offset-4"
                    href={department.inquiryUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    問い合わせページを開く
                  </a>
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-[0_18px_60px_rgba(55,60,80,0.08)]">
            <h2 className="font-[family:var(--font-heading)] text-2xl font-bold text-slate-950">
              関連する窓口
            </h2>
            {relatedDepartments.length === 0 ? (
              <p className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                この窓口の関連先はまだ整理中です。まずは公式リンクと所属カテゴリを起点に確認してください。
              </p>
            ) : (
              <div className="mt-5 grid gap-3">
                {relatedDepartments.map((relatedDepartment) => (
                  <Link
                    key={relatedDepartment.id}
                    href={`/departments/${relatedDepartment.slug}`}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:-translate-y-0.5 hover:border-slate-950"
                  >
                    <p className="font-semibold text-slate-950">{relatedDepartment.name}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {relatedDepartment.shortDescription}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </aside>
      </section>

      <section className="rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-[0_18px_60px_rgba(55,60,80,0.08)]">
        <h2 className="font-[family:var(--font-heading)] text-2xl font-bold text-slate-950">
          情報ソースと関連性
        </h2>
        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Source URLs</p>
            <ul className="mt-4 grid gap-3 text-sm text-slate-700">
              {department.sourceUrls.map((sourceUrl) => (
                <li key={sourceUrl}>
                  <a
                    className="break-all text-amber-700 underline decoration-amber-300 underline-offset-4"
                    href={sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {sourceUrl}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Relation Notes</p>
            {relatedRelations.length === 0 ? (
              <p className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-600">
                この窓口は一覧先行で追加しているため、関係線メモはこれから補強します。
              </p>
            ) : (
              <ul className="mt-4 grid gap-3 text-sm text-slate-700">
                {relatedRelations.map((relation) => (
                  <li key={relation.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <p className="font-semibold text-slate-950">{relation.label}</p>
                    <p className="mt-1 text-slate-600">{relation.note}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
