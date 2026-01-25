import { MetadataRoute } from 'next';
import { getHwalseoList } from '@/lib/notion';
import { getElderList } from '@/lib/notion';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://samhwalin.org';

  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/hwalseo`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/elders`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/testype`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/qna`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // 동적 페이지: 활서 목록
  let hwalseoPages: MetadataRoute.Sitemap = [];
  try {
    const hwalseoList = await getHwalseoList();
    hwalseoPages = hwalseoList.map((hwalseo) => ({
      url: `${baseUrl}/hwalseo/${hwalseo.slug}`,
      lastModified: new Date(hwalseo.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error fetching hwalseo list for sitemap:', error);
  }

  // 동적 페이지: 어르신 프로필
  let elderPages: MetadataRoute.Sitemap = [];
  try {
    const elderList = await getElderList();
    elderPages = elderList.map((elder) => ({
      url: `${baseUrl}/elders/${elder.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching elder list for sitemap:', error);
  }

  return [...staticPages, ...hwalseoPages, ...elderPages];
}
