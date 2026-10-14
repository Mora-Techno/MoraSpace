import { BLOG_ENDPOINTS } from '../endpoints/blog.endpoints';
import type { TResponse } from '../types/response.types';
import type { BlogListItem, BlogQuery, IBlogPost } from '../types/blog.types';
import { GetResponse, withQuery } from './http';
import { toServiceResponse } from './service-response';

class BlogService {
  public async ListPosts(query?: BlogQuery): Promise<TResponse<BlogListItem[]>> {
    const res = await GetResponse<BlogListItem[]>(withQuery(BLOG_ENDPOINTS.LIST, query));
    return toServiceResponse(res, { message: 'Daftar artikel berhasil diambil' });
  }

  public async GetPost(slug: string): Promise<TResponse<IBlogPost>> {
    const res = await GetResponse<IBlogPost>(BLOG_ENDPOINTS.BY_SLUG(slug));
    return toServiceResponse(res, { message: 'Detail artikel berhasil diambil' });
  }
}

export default new BlogService();
