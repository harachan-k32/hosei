import { RelationshipMap } from "@/components/map/relationship-map";
import { departments, relations } from "@/lib/data";

export const metadata = {
  title: "関係マップ",
};

export default function MapPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-[0_24px_80px_rgba(55,60,80,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Relationship Map
        </p>
        <h1 className="mt-3 font-[family:var(--font-heading)] text-4xl font-bold tracking-tight text-slate-950">
          問い合わせ導線を、窓口同士のつながりで見る
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
          同カテゴリ、業務連携、導線上の近さ、誤問い合わせが起きやすい関連先を色分けしています。ノードを選ぶ
          と、その窓口の周辺関係が浮き上がります。
        </p>
      </section>

      <RelationshipMap
        departments={departments}
        relations={relations}
        selectedSlug={departments[0]?.slug}
        title="全体マップ"
        description="スクロールしながら全カテゴリを横断できます。カードからそのまま詳細ページへ移動できます。"
      />
    </main>
  );
}
