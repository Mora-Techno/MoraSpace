export type TrackStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ITrackCatalog {
  id: string;
  companyId: string | null;
  companyMemberId: string | null;
  userId: string | null;
  title: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  status: TrackStatus;
  rejectionReason: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type TrackCatalog = Pick<
  ITrackCatalog,
  | "id"
  | "title"
  | "youtubeUrl"
  | "youtubeVideoId"
  | "status"
  | "rejectionReason"
  | "reviewedAt"
  | "createdAt"
  | "updatedAt"
> & {
  submittedBy?: string;
};

export type PickSubmitTrack = Pick<ITrackCatalog, "title" | "youtubeUrl">;

export type PickReviewTrack = {
  rejectionReason?: string;
};

export type TrackCatalogQuery = {
  search?: string;
  status?: TrackStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
