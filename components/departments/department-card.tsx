"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDateLabel } from "@/lib/formatters";
import type { Department, DepartmentCategory } from "@/lib/types";

type DepartmentCardProps = {
  category?: DepartmentCategory;
  department: Department;
};

export function DepartmentCard({ category, department }: DepartmentCardProps) {
  return (
    <article className="group rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-[0_18px_50px_rgba(55,60,80,0.08)] transition hover:-translate-y-1 hover:border-slate-950">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500">{category?.name ?? "未分類"}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">{department.name}</h3>
        </div>
        <Badge variant={department.status === "active" ? "category" : "neutral"}>
          {department.status === "active" ? "受付中" : "情報のみ"}
        </Badge>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-700">{department.shortDescription}</p>

      <div className="mt-4 flex flex-wrap gap-2">
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
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">主な問い合わせ例</p>
        <ul className="mt-2 grid gap-2 text-sm leading-6 text-slate-700">
          {department.inquiryExamples.slice(0, 2).map((example) => (
            <li key={example}>{example}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 text-sm text-slate-600">
        <span>更新 {formatDateLabel(department.updatedAt)}</span>
        <Link
          href={`/departments/${department.slug}`}
          className="rounded-full bg-slate-950 px-4 py-2 font-medium text-white transition group-hover:bg-amber-600"
        >
          詳細を見る
        </Link>
      </div>
    </article>
  );
}
