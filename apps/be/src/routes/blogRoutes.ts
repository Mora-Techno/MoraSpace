import Elysia from 'elysia';
import BlogController from '@/controllers/BlogController';
import { BlogParamsDto, BlogQueryDto } from '@/dto/blog.dto';
import type { AppContext } from '@/contex';

/** v1.x Blog publik — tanpa verifyToken (hanya artikel published). */
class BlogRouter {
  public blogRouter;

  constructor() {
    this.blogRouter = new Elysia({ prefix: '/blogs', tags: ['Blogs'] });
    this.routes();
  }

  private routes() {
    this.blogRouter.get('/', (c: AppContext) => BlogController.list(c), {
      query: BlogQueryDto,
      detail: { summary: 'Daftar artikel publik', tags: ['Blogs'] },
    });
    this.blogRouter.get('/:slug', (c: AppContext) => BlogController.detail(c), {
      params: BlogParamsDto,
      detail: { summary: 'Detail artikel publik', tags: ['Blogs'] },
    });
  }
}

export default new BlogRouter().blogRouter;
