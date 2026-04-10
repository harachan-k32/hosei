import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "category" | "campus" | "course" | "neutral";
};

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  category: "bg-slate-950 text-white",
  campus: "border border-sky-200 bg-sky-50 text-sky-800",
  course: "border border-amber-200 bg-amber-50 text-amber-800",
  neutral: "border border-slate-200 bg-white text-slate-700",
};

export function Badge({ children, variant = "neutral" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
