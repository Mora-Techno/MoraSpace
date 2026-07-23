export interface IPosition {
  id: string;
  companyId: string;
  name: string;
  level: number;
  description: string | null;
}

export type PickCreatePosition = {
  name: string;
  level?: number;
  description?: string;
};

export type PickUpdatePosition = Partial<PickCreatePosition>;

export type PositionQuery = {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  level?: number;
};
