// ----- Domain model -----
export interface Classification {
  id: string;
  name: string;
  shortName: string;
  type: string; // e.g. "Branch" | "Department" | "Team" | "Cost Center" | custom
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// ----- Form values (create/edit) -----
export interface ClassificationFormValues {
  name: string;
  shortName: string;
  type: string;
  description?: string;
  active: boolean;
}

export type ClassificationFormErrors = Partial<Record<keyof ClassificationFormValues, string>>;

// ----- List query params / filters -----
export type ClassificationStatusFilter = "all" | "active" | "inactive";

export interface ClassificationFilters {
  search: string;
  status: ClassificationStatusFilter;
  type: string; // "all" or a specific type
  page: number;
  pageSize: number;
}

// ----- API response shapes -----
export interface ClassificationListResponse {
  data: Classification[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ClassificationMutationResponse {
  data: Classification;
  message?: string;
}

// ----- Modal / UI state -----
export type ClassificationModalMode = "add" | "edit" | null;
