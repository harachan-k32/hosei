"use client";

import Link from "next/link";
import { useState } from "react";
import { DepartmentCard } from "@/components/departments/department-card";
import { RelationshipMap } from "@/components/map/relationship-map";
import { Badge } from "@/components/ui/badge";
import { formatDateLabel } from "@/lib/formatters";
import type {
  DepartmentCategory,
  DepartmentRelation,
  ScrapeJob,
} from "@/lib/types";
import type { Department } from "@/lib/types";

type DirectoryShellProps = {
  categories: DepartmentCategory[];
  departments: Department[];
  relations: DepartmentRelation[];
  scrapeJobs: ScrapeJob[];
};

export function DirectoryShell({
  categories,
  departments,
  relations,
  scrapeJobs,
}: DirectoryShellProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCampus, setSelectedCampus] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const normalizedSearch = search.trim().toLowerCase();
  const filteredDepartments = departments.filter((department) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      [
        department.name,
        department.officialName,
        department.shortDescription,
        department.longDescription,
        department.inquiryExamples.join(" "),
        department.tags.join(" "),
        categories.find((category) => category.id === department.categoryId)?.name ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesCategory =
      selectedCategory === "all" || department.categoryId === selectedCategory;
    const matchesCampus =
      selectedCampus === "all" || department.campusTypes.includes(selectedCampus);
    const matchesCourse =
      selectedCourse === "all" || department.courseTypes.includes(selectedCourse);
    const matchesStatus = selectedStatus === "all" || department.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesCampus && matchesCourse && matchesStatus;
  });

  const visibleIds = new Set(filteredDepartments.map((department) => department.id));
  const filteredRelations = relations.filter(
    (relation) => visibleIds.has(relation.fromDepartmentId) && visibleIds.has(relation.toDepartmentId),
  );
  const latestJob = scrapeJobs[0];

  return (
    <div className="grid gap-8">
      <section className="grid gap-4 rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-[0_18px_60px_rgba(55,60,80,0.08)] lg:grid-cols-[1.3fr_0.7fr]">
        <div className="grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Search
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="課名、問い合わせ例、カテゴリ、タグで検索"
              className="h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-base text-slate-950 outline-none transition focus:border-slate-950"
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <FilterSelect
              label="カテゴリ"
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={[
                { label: "すべて", value: "all" },
                ...categories.map((category) => ({ label: category.name, value: category.id })),
              ]}
            />
            <FilterSelect
              label="キャンパス"
              value={selectedCampus}
              onChange={setSelectedCampus}
              options={[
                { label: "すべて", value: "all" },
                { label: "市ケ谷", value: "市ケ谷" },
                { label: "多摩", value: "多摩" },
                { label: "小金井", value: "小金井" },
                { label: "共通", value: "共通" },
              ]}
            />
            <FilterSelect
              label="課程"
              value={selectedCourse}
              onChange={setSelectedCourse}
              options={[
                { label: "すべて", value: "all" },
                { label: "通学課程", value: "通学課程" },
                { label: "通信教育部", value: "通信教育部" },
                { label: "共通", value: "共通" },
              ]}
            />
            <FilterSelect
              label="公開状態"
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={[
                { label: "すべて", value: "all" },
                { label: "受付中", value: "active" },
                { label: "情報のみ", value: "info" },
              ]}
            />
          </div>
        </div>

        <aside className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Data pulse</p>
          <dl className="mt-4 grid gap-3 text-sm text-slate-700">
            <div className="rounded-2xl bg-white px-4 py-3">
              <dt className="text-slate-500">表示件数</dt>
              <dd className="mt-1 text-2xl font-semibold text-slate-950">
                {filteredDepartments.length} / {departments.length}
              </dd>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3">
              <dt className="text-slate-500">直近ジョブ</dt>
              <dd className="mt-1 font-semibold text-slate-950">{latestJob.resultSummary}</dd>
              <p className="mt-1 text-xs text-slate-500">{formatDateLabel(latestJob.finishedAt)}</p>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3">
              <dt className="text-slate-500">共有URL</dt>
              <dd className="mt-1 leading-6 text-slate-700">
                詳細ページごとに個別URLを発行し、OGPプレビューにも対応しています。
              </dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <InfoTile
          title="使い方"
          description="まず困りごとを検索し、カードから詳細へ。関連マップで迷いがちな窓口を見比べられます。"
        />
        <InfoTile
          title="関係性の凡例"
          description="金色は導線、青は業務連携、緑は同カテゴリ、赤は誤問い合わせ注意を表します。"
        />
        <InfoTile
          title="管理導線"
          description="スクレイピング結果と手動補完は管理画面へ集約し、閲覧体験との責務を分離しています。"
        />
      </section>

      <RelationshipMap
        departments={filteredDepartments}
        relations={filteredRelations}
        title="問い合わせ先マップ"
        description="選択中の検索条件に一致する窓口だけを描画しています。"
      />

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Directory</p>
            <h2 className="mt-1 font-[family:var(--font-heading)] text-3xl font-bold text-slate-950">
              問い合わせカード一覧
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="neutral">検索対象: 課名 / 説明 / 問い合わせ例 / タグ</Badge>
            <Link
              href="/map"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:border-slate-950"
            >
              全画面マップへ
            </Link>
          </div>
        </div>

        {filteredDepartments.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-12 text-center text-slate-600">
            条件に一致する窓口がありません。カテゴリかキャンパス条件をゆるめると、近い候補が見つかりやすくなります。
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {filteredDepartments.map((department) => (
              <DepartmentCard
                key={department.id}
                category={categories.find((category) => category.id === department.categoryId)}
                department={department}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

type FilterSelectProps = {
  label: string;
  options: Array<{
    label: string;
    value: string;
  }>;
  value: string;
  onChange: (value: string) => void;
};

function FilterSelect({ label, options, value, onChange }: FilterSelectProps) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-600">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-slate-950"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function InfoTile({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[1.75rem] border border-white/60 bg-white/80 p-5 shadow-[0_18px_50px_rgba(55,60,80,0.08)]">
      <p className="text-sm uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <p className="mt-3 text-sm leading-7 text-slate-700">{description}</p>
    </div>
  );
}
