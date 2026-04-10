import type { Department } from "@/lib/types";

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatDateLabel(value: string) {
  return dateFormatter.format(new Date(value));
}

export function getLatestUpdateLabel(departments: Department[]) {
  const latestTimestamp = departments.reduce((max, department) => {
    const timestamp = new Date(department.updatedAt).getTime();
    return timestamp > max ? timestamp : max;
  }, 0);

  return formatDateLabel(new Date(latestTimestamp).toISOString());
}
