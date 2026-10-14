import type { AppContext } from '@/contex';
import { HttpResponse } from '@/http';
import BlogService from '@/service/BlogService';

class BlogController {
  public async list(c: AppContext) {
    try {
      const result = await BlogService.listPublished(c.query as never);
      return HttpResponse(c).ok(result.data, result.meta, 'Daftar artikel');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async detail(c: AppContext) {
    try {
      const params = c.params as { slug: string };
      if (!params.slug) return HttpResponse(c).notFound('Artikel tidak ditemukan');
      const data = await BlogService.getPublishedBySlug(params.slug);
      if (!data) return HttpResponse(c).notFound('Artikel tidak ditemukan');
      return HttpResponse(c).ok(data, undefined, 'Detail artikel');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new BlogController();
