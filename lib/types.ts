export type DepartmentCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
};

export type DepartmentStatus = "active" | "info";

export type Department = {
  id: string;
  slug: string;
  name: string;
  officialName: string;
  shortDescription: string;
  longDescription: string;
  categoryId: string;
  audienceTypes: string[];
  campusTypes: string[];
  courseTypes: string[];
  phone: string;
  email: string;
  inquiryUrl: string;
  officeHours: string;
  tags: string[];
  inquiryExamples: string[];
  cautionNotes: string[];
  sourceUrls: string[];
  sourceHash: string;
  status: DepartmentStatus;
  lastScrapedAt: string;
  updatedAt: string;
  relatedSlugs: string[];
};

export type RelationType = "sameCategory" | "collaboration" | "journey" | "misroute";

export type DepartmentRelation = {
  id: string;
  fromDepartmentId: string;
  toDepartmentId: string;
  relationType: RelationType;
  label: string;
  weight: 1 | 2 | 3;
  note: string;
};

export type ScrapeJobStatus = "success" | "running" | "failed";

export type ScrapeJob = {
  id: string;
  targetUrl: string;
  status: ScrapeJobStatus;
  startedAt: string;
  finishedAt: string;
  resultSummary: string;
  errorMessage?: string;
};
