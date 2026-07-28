/** Mirrors the Prisma TrackStatus enum */
export type TrackStatus = "PENDING" | "APPROVED" | "REJECTED";

/** Mirrors the Prisma TrackCatalog model */
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

/** Safe API response shape for a track catalog entry */
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
  /** Display name of the submitter */
  submittedBy?: string;
};

/** Payload for submitting a new track */
export type PickSubmitTrack = Pick<ITrackCatalog, "title" | "youtubeUrl">;

/** Payload for approving / rejecting a track */
export type PickReviewTrack = {
  rejectionReason?: string;
};

/** Query parameters for listing track catalog entries */
export type TrackCatalogQuery = {
  search?: string;
  status?: TrackStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
