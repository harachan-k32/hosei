"use client";

import Link from "next/link";
import { getRelationColor, groupDepartmentsByCategory } from "@/lib/graph";
import type { Department, DepartmentRelation } from "@/lib/types";

type RelationshipMapProps = {
  departments: Department[];
  relations: DepartmentRelation[];
  selectedSlug?: string;
  title: string;
  description: string;
};

type Point = {
  x: number;
  y: number;
};

const NODE_WIDTH = 220;
const NODE_HEIGHT = 116;
const HORIZONTAL_GAP = 270;
const VERTICAL_GAP = 160;
const PADDING_X = 36;
const PADDING_Y = 44;

export function RelationshipMap({
  departments,
  relations,
  selectedSlug,
  title,
  description,
}: RelationshipMapProps) {
  const groupedDepartments = groupDepartmentsByCategory(departments);
  const maxColumns = Math.max(...groupedDepartments.map((group) => group.departments.length), 1);
  const width = maxColumns * HORIZONTAL_GAP + NODE_WIDTH + PADDING_X * 2;
  const height = groupedDepartments.length * VERTICAL_GAP + NODE_HEIGHT + PADDING_Y * 2;
  const points = new Map<string, Point>();

  groupedDepartments.forEach((group, rowIndex) => {
    group.departments.forEach((department, columnIndex) => {
      points.set(department.id, {
        x: PADDING_X + columnIndex * HORIZONTAL_GAP,
        y: PADDING_Y + rowIndex * VERTICAL_GAP,
      });
    });
  });

  return (
    <section className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-[0_18px_60px_rgba(55,60,80,0.08)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Map view</p>
          <h2 className="mt-1 font-[family:var(--font-heading)] text-3xl font-bold text-slate-950">
            {title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
          <LegendChip color="#2f855a" label="同カテゴリ" />
          <LegendChip color="#2b6cb0" label="業務連携" />
          <LegendChip color="#c98a2a" label="導線が近い" />
          <LegendChip color="#c53030" label="誤問い合わせ注意" />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,_rgba(247,249,252,0.96),_rgba(255,255,255,0.96))]">
        <div className="relative" style={{ height, minWidth: width }}>
          <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${width} ${height}`}>
            {relations.map((relation) => {
              const from = points.get(relation.fromDepartmentId);
              const to = points.get(relation.toDepartmentId);

              if (!from || !to) {
                return null;
              }

              const startX = from.x + NODE_WIDTH / 2;
              const startY = from.y + NODE_HEIGHT / 2;
              const endX = to.x + NODE_WIDTH / 2;
              const endY = to.y + NODE_HEIGHT / 2;
              const curveOffset = Math.max(Math.abs(endY - startY) / 2, 48);
              const path = `M ${startX} ${startY} C ${startX + 60} ${startY}, ${endX - 60} ${
                endY - curveOffset
              }, ${endX} ${endY}`;

              return (
                <path
                  key={relation.id}
                  d={path}
                  fill="none"
                  stroke={getRelationColor(relation.relationType)}
                  strokeDasharray={relation.relationType === "misroute" ? "10 10" : undefined}
                  strokeWidth={relation.weight === 3 ? 4 : 3}
                  strokeOpacity={0.8}
                />
              );
            })}
          </svg>

          {groupedDepartments.map((group, rowIndex) => (
            <div
              key={group.categoryId}
              className="absolute left-0 right-0"
              style={{ top: PADDING_Y + rowIndex * VERTICAL_GAP - 28 }}
            >
              <div className="pl-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {group.categoryName}
              </div>
            </div>
          ))}

          {departments.map((department) => {
            const point = points.get(department.id);

            if (!point) {
              return null;
            }

            const isSelected = selectedSlug === department.slug;

            return (
              <Link
                key={department.id}
                href={`/departments/${department.slug}`}
                className={`absolute flex flex-col justify-between rounded-[1.5rem] border p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-slate-950 ${
                  isSelected
                    ? "border-amber-400 bg-amber-50"
                    : "border-white/80 bg-white/95 hover:bg-slate-50"
                }`}
                style={{
                  height: NODE_HEIGHT,
                  left: point.x,
                  top: point.y,
                  width: NODE_WIDTH,
                }}
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    {department.campusTypes.join(" / ")}
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-950">{department.name}</p>
                </div>
                <p className="text-sm leading-6 text-slate-600">{department.shortDescription}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LegendChip({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
