import prisma from 'prisma/client';

const PUBLIC_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  category: true,
  authorName: true,
  publishedAt: true,
  createdAt: true,
} as const;

class BlogService {
  public async listPublished(
    query: { search?: string; category?: string; page?: number; limit?: number } = {},
  ) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 9, 50);
    const skip = (page - 1) * limit;

    const where = {
      status: 'published' as const,
      ...(query.category ? { category: query.category } : {}),
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search, mode: 'insensitive' as const } },
              { excerpt: { contains: query.search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [totalData, data] = await Promise.all([
      prisma.blogPost.count({ where }),
      prisma.blogPost.findMany({
        where,
        select: PUBLIC_SELECT,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        take: limit,
        skip,
      }),
    ]);

    const categories = await prisma.blogPost.findMany({
      where: { status: 'published' },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    return {
      data,
      meta: {
        currentPage: page,
        limit,
        totalData,
        totalPage: Math.ceil(totalData / limit),
        categories: categories.map((c) => c.category),
      },
    };
  }

  public async getPublishedBySlug(slug: string) {
    return prisma.blogPost.findFirst({
      where: { slug, status: 'published' },
    });
  }
}

export default new BlogService();
