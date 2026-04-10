import { categories } from "@/lib/data";
import type { Department, RelationType } from "@/lib/types";

export function getRelationColor(type: RelationType) {
  switch (type) {
    case "sameCategory":
      return "#2f855a";
    case "collaboration":
      return "#2b6cb0";
    case "journey":
      return "#c98a2a";
    case "misroute":
      return "#c53030";
    default:
      return "#64748b";
  }
}

export function groupDepartmentsByCategory(departments: Department[]) {
  return categories
    .map((category) => ({
      categoryId: category.id,
      categoryName: category.name,
      sortOrder: category.sortOrder,
      departments: departments.filter((department) => department.categoryId === category.id),
    }))
    .filter((group) => group.departments.length > 0)
    .sort((left, right) => left.sortOrder - right.sortOrder);
}
