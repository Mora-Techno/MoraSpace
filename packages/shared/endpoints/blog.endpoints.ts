import { buildEndpoint } from '../config/api.config';

const mount = '/blogs';

export const BLOG_ENDPOINTS = {
  LIST: buildEndpoint(mount),
  BY_SLUG: (slug: string) => buildEndpoint(mount, `/${slug}`),
} as const;

export function listBlogEndpoints() {
  return Object.keys(BLOG_ENDPOINTS).map((key) => ({
    name: key,
    path: BLOG_ENDPOINTS[key as keyof typeof BLOG_ENDPOINTS],
  }));
}
