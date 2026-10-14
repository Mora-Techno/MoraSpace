export type BlogStatus = 'draft' | 'published';

export interface IBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  category: string;
  authorName: string;
  status: BlogStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type BlogListItem = Pick<
  IBlogPost,
  'id' | 'title' | 'slug' | 'excerpt' | 'category' | 'authorName' | 'publishedAt' | 'createdAt'
>;

export interface BlogQuery {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface BlogListMeta {
  currentPage: number;
  limit: number;
  totalData: number;
  totalPage: number;
  categories: string[];
}
