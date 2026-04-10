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

type ClusterFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const NODE_WIDTH = 224;
const NODE_HEIGHT = 128;
const NODE_GAP_X = 24;
const NODE_GAP_Y = 22;
const CLUSTER_WIDTH = 332;
const CLUSTER_PADDING_X = 18;
const CLUSTER_PADDING_TOP = 44;
const CLUSTER_PADDING_BOTTOM = 20;
const CLUSTER_GAP_X = 28;
const CLUSTER_GAP_Y = 34;
const CLUSTER_COLUMNS = 3;
const PADDING_X = 28;
const PADDING_Y = 28;

export function RelationshipMap({
  departments,
  relations,
  selectedSlug,
  title,
  description,
}: RelationshipMapProps) {
  const groupedDepartments = groupDepartmentsByCategory(departments);
  const points = new Map<string, Point>();
  const clusterFrames = new Map<string, ClusterFrame>();
  const width =
    PADDING_X * 2 +
    CLUSTER_COLUMNS * CLUSTER_WIDTH +
    (CLUSTER_COLUMNS - 1) * CLUSTER_GAP_X;
  const rowHeights = Array.from(
    { length: Math.max(Math.ceil(groupedDepartments.length / CLUSTER_COLUMNS), 1) },
    () => 0,
  );

  groupedDepartments.forEach((group, index) => {
    const clusterRow = Math.floor(index / CLUSTER_COLUMNS);
    const departmentRows = Math.ceil(group.departments.length / 2);
    const clusterHeight =
      CLUSTER_PADDING_TOP +
      CLUSTER_PADDING_BOTTOM +
      departmentRows * NODE_HEIGHT +
      Math.max(departmentRows - 1, 0) * NODE_GAP_Y;

    rowHeights[clusterRow] = Math.max(rowHeights[clusterRow], clusterHeight);
  });

  groupedDepartments.forEach((group, index) => {
    const clusterColumn = index % CLUSTER_COLUMNS;
    const clusterRow = Math.floor(index / CLUSTER_COLUMNS);
    const departmentRows = Math.ceil(group.departments.length / 2);
    const clusterHeight =
      CLUSTER_PADDING_TOP +
      CLUSTER_PADDING_BOTTOM +
      departmentRows * NODE_HEIGHT +
      Math.max(departmentRows - 1, 0) * NODE_GAP_Y;

    clusterFrames.set(group.categoryId, {
      x: PADDING_X + clusterColumn * (CLUSTER_WIDTH + CLUSTER_GAP_X),
      y:
        PADDING_Y +
        rowHeights.slice(0, clusterRow).reduce((sum, value) => sum + value, 0) +
        clusterRow * CLUSTER_GAP_Y,
      width: CLUSTER_WIDTH,
      height: clusterHeight,
    });
  });

  const maxClusterBottom = Math.max(
    ...Array.from(clusterFrames.values()).map((cluster) => cluster.y + cluster.height),
    PADDING_Y + NODE_HEIGHT,
  );
  const height = maxClusterBottom + PADDING_Y;

  groupedDepartments.forEach((group) => {
    const cluster = clusterFrames.get(group.categoryId);

    if (!cluster) {
      return;
    }

    group.departments.forEach((department, index) => {
      const columnIndex = index % 2;
      const rowIndex = Math.floor(index / 2);
      points.set(department.id, {
        x: cluster.x + CLUSTER_PADDING_X + columnIndex * (NODE_WIDTH + NODE_GAP_X),
        y: cluster.y + CLUSTER_PADDING_TOP + rowIndex * (NODE_HEIGHT + NODE_GAP_Y),
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
            <defs>
              <filter id="lineGlow">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="1 0 0 0 0
                          0 1 0 0 0
                          0 0 1 0 0
                          0 0 0 0.22 0"
                  result="shadow"
                />
                <feMerge>
                  <feMergeNode in="shadow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
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
              const controlY = Math.min(startY, endY) - 42;
              const midpointX = (startX + endX) / 2;
              const path = `M ${startX} ${startY} C ${midpointX} ${controlY}, ${midpointX} ${
                Math.max(startY, endY) + 42
              }, ${endX} ${endY}`;

              return (
                <path
                  key={relation.id}
                  d={path}
                  fill="none"
                  filter="url(#lineGlow)"
                  stroke={getRelationColor(relation.relationType)}
                  strokeDasharray={relation.relationType === "misroute" ? "10 10" : undefined}
                  strokeWidth={relation.weight === 3 ? 4 : 3}
                  strokeOpacity={0.72}
                />
              );
            })}
          </svg>

          {groupedDepartments.map((group) => {
            const cluster = clusterFrames.get(group.categoryId);

            if (!cluster) {
              return null;
            }

            return (
              <div
                key={group.categoryId}
                className="absolute rounded-[1.75rem] border border-slate-200/80 bg-white/45 backdrop-blur-[2px]"
                style={{
                  height: cluster.height,
                  left: cluster.x,
                  top: cluster.y,
                  width: cluster.width,
                }}
              >
                <div className="px-5 pt-4 text-sm font-semibold tracking-[0.08em] text-slate-600">
                  {group.categoryName}
                </div>
              </div>
            );
          })}

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
