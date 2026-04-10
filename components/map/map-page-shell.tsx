"use client";

import { useState } from "react";
import { RelationshipMap } from "@/components/map/relationship-map";
import type { Department, DepartmentCategory, DepartmentRelation } from "@/lib/types";

type MapPageShellProps = {
  categories: DepartmentCategory[];
  departments: Department[];
  relations: DepartmentRelation[];
};

export function MapPageShell({
  categories,
  departments,
  relations,
}: MapPageShellProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCampus, setSelectedCampus] = useState("all");

  const categoryOptions = categories.filter((category) =>
    departments.some((department) => department.categoryId === category.id),
  );
  const campusOptions = Array.from(
    new Set(departments.flatMap((department) => department.campusTypes)),
  ).sort((left, right) => left.localeCompare(right, "ja"));

  const filteredDepartments = departments.filter((department) => {
    const matchesCategory =
      selectedCategory === "all" || department.categoryId === selectedCategory;
    const matchesCampus =
      selectedCampus === "all" || department.campusTypes.includes(selectedCampus);

    return matchesCategory && matchesCampus;
  });

  const visibleDepartmentIds = new Set(filteredDepartments.map((department) => department.id));
  const filteredRelations = relations.filter(
    (relation) =>
      visibleDepartmentIds.has(relation.fromDepartmentId) &&
      visibleDepartmentIds.has(relation.toDepartmentId),
  );

  const controls = (
    <div className="flex flex-wrap items-end gap-3">
      <FilterSelect
        label="表示カテゴリ"
        value={selectedCategory}
        onChange={setSelectedCategory}
        options={[
          { label: "すべて", value: "all" },
          ...categoryOptions.map((category) => ({
            label: category.name,
            value: category.id,
          })),
        ]}
      />
      <FilterSelect
        label="表示キャンパス"
        value={selectedCampus}
        onChange={setSelectedCampus}
        options={[
          { label: "すべて", value: "all" },
          ...campusOptions.map((campus) => ({ label: campus, value: campus })),
        ]}
      />
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        {filteredDepartments.length} 件を表示
      </div>
    </div>
  );

  return (
    <RelationshipMap
      departments={filteredDepartments}
      relations={filteredRelations}
      selectedSlug={filteredDepartments[0]?.slug}
      title="全体マップ"
      description="学部系、学生支援系、大学院系までまとめて俯瞰できます。左上のプルダウンで範囲を絞ると、関係線も対象だけに整理されます。"
      controls={controls}
    />
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    label: string;
    value: string;
  }>;
};

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: FilterSelectProps) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 min-w-[180px] rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-slate-950"
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
