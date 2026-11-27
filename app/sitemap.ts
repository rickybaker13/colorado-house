import type { MetadataRoute } from 'next';
import { getServiceClient } from '@/lib/supabase';
import { SITE_URL } from '@/lib/agent/property';

export const revalidate = 3600;

const PAGES: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/booking', priority: 0.9, changeFrequency: 'daily' },
  { path: '/property', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/gallery', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/purgatory-resort', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/practical-info', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/experience', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/san-juan-mountains', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/hiking', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/alpine-lakes', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/lakes-water', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/needles-mountains', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/silverton', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/durango', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.6, changeFrequency: 'weekly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = PAGES.map((p) => ({
    url: `${SITE_URL}${p.path === '/' ? '' : p.path}`,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  try {
    const { data } = await getServiceClient()
      .from('blog_posts')
      .select('slug, published_at')
      .eq('status', 'published');
    for (const post of data ?? []) {
      entries.push({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: post.published_at ? new Date(post.published_at) : undefined,
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
  } catch (err) {
    console.error('sitemap: blog posts unavailable', err);
  }
  return entries;
}
