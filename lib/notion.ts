import { Client } from '@notionhq/client';
import type { Hwalseo, HwalseoCard, Elder, ElderCard } from '@/types';
import { getProxiedImageUrl } from './utils';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const databaseId = process.env.NOTION_HWALSEO_DATABASE_ID!;
const donationDbId = process.env.NOTION_DONATION_DATABASE_ID!;
const settingsDbId = process.env.NOTION_SETTINGS_DATABASE_ID!;
const postcardDbId = process.env.NOTION_POSTCARD_DATABASE_ID!;
const subscriberDbId = process.env.NOTION_SUBSCRIBE_DATABASE_ID!;
const elderDbId = process.env.NOTION_ELDER_DATABASE_ID!;

// ============================================
// 슬러그 생성 헬퍼 함수
// ============================================

/**
 * 활서 슬러그 생성: {elder-slug}-{hwalseo-id-last-4}
 * @param elderSlug 어르신 슬러그 (e.g., "kang-janghwan")
 * @param hwalseoId 활서 ID (UUID)
 * @returns 생성된 슬러그 (e.g., "kang-janghwan-a1b2")
 */
function generateHwalseoSlug(elderSlug: string, hwalseoId: string): string {
  // Remove dashes from hwalseo ID and get last 4 characters
  const cleanId = hwalseoId.replace(/-/g, '');
  const shortId = cleanId.slice(-4).toLowerCase();
  return `${elderSlug}-${shortId}`;
}

// 어르신 슬러그 캐시 (elderId -> slug)
const elderSlugCache = new Map<string, string>();

/**
 * 어르신 ID로 슬러그 가져오기 (캐시 활용)
 */
async function getElderSlugById(elderId: string): Promise<string | null> {
  // 캐시 확인
  if (elderSlugCache.has(elderId)) {
    return elderSlugCache.get(elderId)!;
  }

  try {
    const page = (await notion.pages.retrieve({ page_id: elderId })) as any;
    const slug = page.properties.Slug?.rich_text?.[0]?.plain_text || null;

    if (slug) {
      elderSlugCache.set(elderId, slug);
    }

    return slug;
  } catch (error) {
    console.error('Error fetching elder slug:', error);
    return null;
  }
}

export async function getHwalseoList(): Promise<HwalseoCard[]> {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Status',
        select: {
          equals: 'Published',
        },
      },
      sorts: [
        {
          property: 'PublishedAt',
          direction: 'descending',
        },
      ],
    });

    // 각 활서에 대해 어르신 슬러그를 가져와서 활서 슬러그 생성
    const hwalseoList = await Promise.all(
      response.results.map(async (page: any) => {
        const elderId = page.properties.Elder?.relation?.[0]?.id;
        let slug = page.properties.Slug?.rich_text?.[0]?.plain_text || '';

        // 어르신이 연결되어 있고, 기존 슬러그가 없으면 자동 생성
        if (elderId && !slug) {
          const elderSlug = await getElderSlugById(elderId);
          if (elderSlug) {
            slug = generateHwalseoSlug(elderSlug, page.id);
          }
        }

        return {
          id: page.id,
          slug,
          title: page.properties.Title?.title?.[0]?.plain_text || '',
          elderName: page.properties.ElderName?.rich_text?.[0]?.plain_text || '',
          elderId,
          theme: page.properties.Theme?.select?.name || '',
          excerpt: page.properties.Excerpt?.rich_text?.[0]?.plain_text || '',
          coverImage: getProxiedImageUrl(page.cover?.external?.url || page.cover?.file?.url || ''),
          publishedAt: page.properties.PublishedAt?.date?.start || '',
        };
      })
    );

    return hwalseoList;
  } catch (error) {
    console.error('Error fetching hwalseo list:', error);
    return [];
  }
}

export async function getHwalseoBySlug(slug: string): Promise<Hwalseo | null> {
  try {
    // 먼저 Notion에 저장된 슬러그로 검색
    let response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: 'Slug',
            rich_text: {
              equals: slug,
            },
          },
          {
            property: 'Status',
            select: {
              equals: 'Published',
            },
          },
        ],
      },
    });

    // 슬러그가 없으면, 자동 생성된 슬러그인지 확인
    // 형식: {elder-slug}-{last-4-chars-of-hwalseo-id}
    if (response.results.length === 0) {
      const lastDashIndex = slug.lastIndexOf('-');
      if (lastDashIndex > 0) {
        const shortId = slug.slice(lastDashIndex + 1).toLowerCase();
        const elderSlugFromUrl = slug.slice(0, lastDashIndex);

        // shortId가 4자인 경우에만 자동 생성된 슬러그로 판단
        if (shortId.length === 4) {
          // 먼저 Elder 슬러그로 어르신 찾기 (더 효율적)
          const elderResponse = await notion.databases.query({
            database_id: elderDbId,
            filter: {
              and: [
                {
                  property: 'Slug',
                  rich_text: {
                    equals: elderSlugFromUrl,
                  },
                },
                {
                  property: 'Status',
                  select: {
                    equals: 'Published',
                  },
                },
              ],
            },
          });

          if (elderResponse.results.length > 0) {
            const elderPage = elderResponse.results[0] as any;
            const elderId = elderPage.id;

            // 해당 어르신의 활서 목록 가져오기
            const elderHwalseos = await notion.databases.query({
              database_id: databaseId,
              filter: {
                and: [
                  {
                    property: 'Status',
                    select: {
                      equals: 'Published',
                    },
                  },
                  {
                    property: 'Elder',
                    relation: {
                      contains: elderId,
                    },
                  },
                ],
              },
            });

            // ID 끝 4자리가 일치하는 활서 찾기
            for (const page of elderHwalseos.results as any[]) {
              const cleanId = page.id.replace(/-/g, '');
              const pageShortId = cleanId.slice(-4).toLowerCase();

              if (pageShortId === shortId) {
                response = { results: [page], has_more: false, type: 'page_or_database', page_or_database: {}, next_cursor: null, object: 'list' };
                break;
              }
            }
          }
        }
      }
    }

    if (response.results.length === 0) {
      return null;
    }

    const page: any = response.results[0];
    const coverImageUrl = page.cover?.external?.url || page.cover?.file?.url || '';
    const content = await getPageContent(page.id, coverImageUrl);

    // 슬러그 결정: 저장된 값 또는 자동 생성
    let finalSlug = page.properties.Slug?.rich_text?.[0]?.plain_text || '';
    const elderId = page.properties.Elder?.relation?.[0]?.id;
    if (!finalSlug && elderId) {
      const elderSlug = await getElderSlugById(elderId);
      if (elderSlug) {
        finalSlug = generateHwalseoSlug(elderSlug, page.id);
      }
    }

    return {
      id: page.id,
      slug: finalSlug,
      title: page.properties.Title?.title?.[0]?.plain_text || '',
      elderName: page.properties.ElderName?.rich_text?.[0]?.plain_text || '',
      elderAge: page.properties.ElderAge?.number || '',
      elderId,
      theme: page.properties.Theme?.select?.name || '',
      excerpt: page.properties.Excerpt?.rich_text?.[0]?.plain_text || '',
      content: content,
      coverImage: getProxiedImageUrl(coverImageUrl),
      publishedAt: page.properties.PublishedAt?.date?.start || '',
      createdAt: page.created_time,
      updatedAt: page.last_edited_time,
    };
  } catch (error) {
    console.error('Error fetching hwalseo by slug:', error);
    return null;
  }
}

async function getPageContent(pageId: string, coverImageUrl?: string): Promise<string> {
  try {
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    });

    // Filter out first image if it matches cover image (avoid duplicate display)
    let filteredBlocks = blocks.results;
    if (coverImageUrl && filteredBlocks.length > 0) {
      const firstBlock = filteredBlocks[0] as any;
      if (firstBlock.type === 'image') {
        const firstImageUrl = firstBlock.image?.file?.url || firstBlock.image?.external?.url || '';
        // Compare base URLs (without query params for Notion signed URLs)
        // Extract just the path/filename for more robust comparison
        const getImageKey = (url: string) => {
          const base = url.split('?')[0];
          // For S3/Notion URLs, extract the unique file identifier
          const matches = base.match(/([a-f0-9-]{36}\/[^/]+)$/);
          return matches ? matches[1] : base;
        };
        const coverKey = getImageKey(coverImageUrl);
        const firstKey = getImageKey(firstImageUrl);
        if (coverKey === firstKey) {
          filteredBlocks = filteredBlocks.slice(1);
        }
      }
    }

    return blocksToMarkdown(filteredBlocks);
  } catch (error) {
    console.error('Error fetching page content:', error);
    return '';
  }
}

function blocksToMarkdown(blocks: any[]): string {
  return blocks
    .map((block) => {
      const type = block.type;

      switch (type) {
        case 'paragraph':
          return richTextToString(block.paragraph.rich_text);
        case 'heading_1':
          return `# ${richTextToString(block.heading_1.rich_text)}`;
        case 'heading_2':
          return `## ${richTextToString(block.heading_2.rich_text)}`;
        case 'heading_3':
          return `### ${richTextToString(block.heading_3.rich_text)}`;
        case 'bulleted_list_item':
          return `• ${richTextToString(block.bulleted_list_item.rich_text)}`;
        case 'numbered_list_item':
          return `1. ${richTextToString(block.numbered_list_item.rich_text)}`;
        case 'quote':
          return `> ${richTextToString(block.quote.rich_text)}`;
        case 'divider':
          return '---';
        case 'image':
          const imageUrl = getProxiedImageUrl(block.image?.file?.url || block.image?.external?.url || '');
          const caption = block.image?.caption?.[0]?.plain_text || '';
          // ||| 구분자 사용 (URL에 포함되지 않는 문자)
          return `[IMG]${imageUrl}[/IMG]${caption ? `[CAP]${caption}[/CAP]` : ''}`;
        default:
          return '';
      }
    })
    .filter(Boolean)
    .join('\n\n');
}

function richTextToString(richText: any[]): string {
  if (!richText || richText.length === 0) return '';

  return richText.map((item) => {
    let text = item.plain_text || item.text?.content || '';
    const annotations = item.annotations || {};

    // Apply formatting in order (innermost first)
    if (annotations.code) {
      text = `\`${text}\``;
    }
    if (annotations.bold) {
      text = `**${text}**`;
    }
    if (annotations.italic) {
      text = `*${text}*`;
    }
    if (annotations.strikethrough) {
      text = `~~${text}~~`;
    }
    if (annotations.underline) {
      text = `<u>${text}</u>`;
    }

    // Handle links
    if (item.href) {
      text = `[${text}](${item.href})`;
    }

    // Handle colors (use custom markers that we'll process in ContentRenderer)
    if (annotations.color && annotations.color !== 'default') {
      const color = annotations.color;
      if (color.includes('_background')) {
        const bgColor = color.replace('_background', '');
        text = `[HIGHLIGHT:${bgColor}]${text}[/HIGHLIGHT]`;
      } else {
        text = `[COLOR:${color}]${text}[/COLOR]`;
      }
    }

    return text;
  }).join('');
}

export async function getRelatedHwalseos(
  currentId: string,
  theme: string,
  limit: number = 2
): Promise<HwalseoCard[]> {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: 'Status',
            select: {
              equals: 'Published',
            },
          },
          {
            property: 'Theme',
            select: {
              equals: theme,
            },
          },
        ],
      },
      page_size: limit + 1,
    });

    const filteredPages = response.results
      .filter((page: any) => page.id !== currentId)
      .slice(0, limit);

    const hwalseoList = await Promise.all(
      filteredPages.map(async (page: any) => {
        const elderId = page.properties.Elder?.relation?.[0]?.id;
        let slug = page.properties.Slug?.rich_text?.[0]?.plain_text || '';

        if (elderId && !slug) {
          const elderSlug = await getElderSlugById(elderId);
          if (elderSlug) {
            slug = generateHwalseoSlug(elderSlug, page.id);
          }
        }

        return {
          id: page.id,
          slug,
          title: page.properties.Title?.title?.[0]?.plain_text || '',
          elderName: page.properties.ElderName?.rich_text?.[0]?.plain_text || '',
          elderId,
          theme: page.properties.Theme?.select?.name || '',
          excerpt: page.properties.Excerpt?.rich_text?.[0]?.plain_text || '',
          coverImage: getProxiedImageUrl(page.cover?.external?.url || page.cover?.file?.url || ''),
          publishedAt: page.properties.PublishedAt?.date?.start || '',
        };
      })
    );

    return hwalseoList;
  } catch (error) {
    console.error('Error fetching related hwalseos:', error);
    return [];
  }
}
// 후원 통계 가져오기
export async function getDonationStats() {
  try {
    // 확인완료된 후원만 가져오기
    const donationsResponse = await notion.databases.query({
      database_id: donationDbId,
      filter: {
        property: 'Status',
        select: {
          equals: '확인완료',
        },
      },
    });

    let totalAmount = 0;
    const uniqueDonors = new Set<string>();
    let thisMonthCount = 0;
    let todayCount = 0;
    const recentDonors: { name: string; amount: number; message?: string }[] = [];

    // 한국 시간 기준으로 오늘 날짜 계산
    const now = new Date();
    const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    const today = koreaTime.toISOString().split('T')[0];
    const thisMonth = today.slice(0, 7);

    donationsResponse.results.forEach((page: any) => {
      const amount = page.properties.Amount?.number || 0;
      const name = page.properties.Name?.title?.[0]?.plain_text || '익명';
      const message = page.properties.Message?.rich_text?.[0]?.plain_text || '';
      const dateStr = page.properties.Date?.date?.start || '';

      totalAmount += amount;
      uniqueDonors.add(name);

      if (dateStr) {
        if (dateStr.startsWith(thisMonth)) {
          thisMonthCount += 1;
        }
        if (dateStr === today) {
          todayCount += 1;
        }
      }

      if (recentDonors.length < 5) {
        recentDonors.push({ name, amount, message });
      }
    });

    const donorCount = uniqueDonors.size;

    // 목표 금액 가져오기
    const settingsResponse = await notion.databases.query({
      database_id: settingsDbId,
      filter: {
        property: 'Key',
        title: {
          equals: '후원목표',
        },
      },
    });

    let goalAmount = 300000;
    if (settingsResponse.results.length > 0) {
      const settingsPage: any = settingsResponse.results[0];
      goalAmount = settingsPage.properties.Value?.number || 300000;
    }

    return {
      current: totalAmount,
      goal: goalAmount,
      donorCount,
      thisMonthCount,
      todayCount,
      recentDonors,
      isGoalReached: totalAmount >= goalAmount,
      percentage: Math.min(Math.round((totalAmount / goalAmount) * 100), 100),
    };
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    return {
      current: 0,
      goal: 300000,
      donorCount: 0,
      thisMonthCount: 0,
      todayCount: 0,
      recentDonors: [],
      isGoalReached: false,
      percentage: 0,
    };
  }
}
// ============================================
// 엽서 관련 함수
// ============================================

export async function createPostcard(data: {
  name: string;
  email: string;
  elderName: string;
  hwalseoSlug: string;
  message: string;
  amount: number;
}) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: postcardDbId },
      properties: {
        Name: {
          title: [{ text: { content: data.name } }],
        },
        Email: {
          email: data.email,
        },
        ElderName: {
          rich_text: [{ text: { content: data.elderName } }],
        },
        HwalseoSlug: {
          rich_text: [{ text: { content: data.hwalseoSlug } }],
        },
        Message: {
          rich_text: [{ text: { content: data.message } }],
        },
        Amount: {
          number: data.amount,
        },
        Status: {
          select: { name: '결제대기' },
        },
        Date: {
          date: { start: new Date().toISOString().split('T')[0] },
        },
      },
    });
    return { success: true, id: response.id };
  } catch (error) {
    console.error('Error creating postcard:', error);
    return { success: false, error };
  }
}
// 후원 저장 함수
export async function createDonation(data: {
  name: string;
  amount: number;
  type: string;
}) {
  try {
    const today = new Date();
    const koreaTime = new Date(today.getTime() + (9 * 60 * 60 * 1000));
    const dateStr = koreaTime.toISOString().split('T')[0];

    const response = await notion.pages.create({
      parent: { database_id: donationDbId },
      properties: {
        Name: {
          title: [{ text: { content: data.name } }],
        },
        Amount: {
          number: data.amount,
        },
        Date: {
          date: { start: dateStr },
        },
        Message: {
          rich_text: [{ text: { content: data.type === 'recurring' ? '정기후원' : '일시후원' } }],
        },
        Status: {
          select: { name: '결제대기' },
        },
      },
    });
    return { success: true, id: response.id };
  } catch (error) {
    console.error('Error creating donation:', error);
    return { success: false, error };
  }
}
// 활서 테마 목록 가져오기
export async function getHwalseoThemes(): Promise<string[]> {
  try {
    const response = await notion.databases.retrieve({
      database_id: databaseId,
    });

    const themeProperty = response.properties['Theme'];

    if (themeProperty && themeProperty.type === 'select') {
      const options = themeProperty.select.options;
      return options.map((option: { name: string }) => option.name);
    }

    return [];
  } catch (error) {
    console.error('Failed to fetch themes:', error);
    return [];
  }
}

// ============================================
// 구독자 관련 함수
// ============================================

export async function checkSubscriberExists(email: string): Promise<boolean> {
  try {
    if (!subscriberDbId) {
      console.error('NOTION_SUBSCRIBE_DATABASE_ID is not defined');
      return false;
    }

    const response = await notion.databases.query({
      database_id: subscriberDbId,
      filter: {
        property: 'Email',
        title: {
          equals: email,
        },
      },
    });
    return response.results.length > 0;
  } catch (error) {
    console.error('Error checking subscriber:', error);
    return false;
  }
}

export async function createSubscriber(data: {
  email: string;
  source: string;
  elderId?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Creating subscriber:', data.email);
    console.log('Database ID:', subscriberDbId);

    if (!subscriberDbId) {
      console.error('NOTION_SUBSCRIBE_DATABASE_ID is not defined');
      return { success: false, error: 'database_not_configured' };
    }

    // 중복 이메일 체크
    const exists = await checkSubscriberExists(data.email);
    if (exists) {
      return { success: false, error: 'duplicate' };
    }

    const today = new Date();
    const koreaTime = new Date(today.getTime() + 9 * 60 * 60 * 1000);
    const dateStr = koreaTime.toISOString().split('T')[0];

    // Build properties object
    const properties: Record<string, unknown> = {
      // Title property - Email
      Email: {
        title: [{ text: { content: data.email } }],
      },
      // Date property - SubscribeAt (exact name from Notion)
      SubscribeAt: {
        date: { start: dateStr },
      },
      // Rich_Text property - Source
      Source: {
        rich_text: [{ text: { content: data.source || 'website' } }],
      },
      // Select property - Status
      Status: {
        select: { name: '활성' },
      },
    };

    // Add ElderId if provided
    if (data.elderId) {
      properties.ElderId = {
        select: { name: data.elderId },
      };
    }

    const response = await notion.pages.create({
      parent: { database_id: subscriberDbId },
      properties: properties as Parameters<typeof notion.pages.create>[0]['properties'],
    });

    console.log('Subscriber created:', response.id);
    return { success: true };
  } catch (error: any) {
    console.error('Error creating subscriber:', error);
    console.error('Error details:', error?.body || error?.message || error);
    return { success: false, error: 'server_error' };
  }
}

// ============================================
// 어르신 관련 함수
// ============================================

export async function getElderList(): Promise<ElderCard[]> {
  try {
    const response = await notion.databases.query({
      database_id: elderDbId,
      filter: {
        property: 'Status',
        select: {
          equals: 'Published',
        },
      },
      sorts: [
        {
          property: 'Name',
          direction: 'ascending',
        },
      ],
    });

    return response.results.map((page: any) => {
      const hwalseoRelation = page.properties.Hwalseo?.relation || [];

      // Debug: Log Photo property structure
      const photoProperty = page.properties.Photo;
      const photoUrl =
        photoProperty?.files?.[0]?.file?.url ||
        photoProperty?.files?.[0]?.external?.url ||
        '';
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[Elder] ${page.properties.Name?.title?.[0]?.plain_text}: Photo property:`,
          JSON.stringify(photoProperty, null, 2)
        );
        console.log(`[Elder] Extracted photo URL: ${photoUrl}`);
      }

      const elderSlug = page.properties.Slug?.rich_text?.[0]?.plain_text || page.id.replaceAll('-', '');

      // 캐시에 저장
      if (page.properties.Slug?.rich_text?.[0]?.plain_text) {
        elderSlugCache.set(page.id, elderSlug);
      }

      return {
        id: page.id,
        name: page.properties.Name?.title?.[0]?.plain_text || '',
        slug: elderSlug,
        photo: getProxiedImageUrl(photoUrl),
        birthYear: page.properties.BirthYear?.number || undefined,
        gender: page.properties.Gender?.select?.name || undefined,
        region: page.properties.Region?.select?.name || undefined,
        introduction:
          page.properties.Introduction?.rich_text?.[0]?.plain_text || undefined,
        hwalseoCount: hwalseoRelation.length,
      };
    });
  } catch (error) {
    console.error('Error fetching elder list:', error);
    return [];
  }
}

export async function getElderById(elderId: string): Promise<Elder | null> {
  try {
    const page = (await notion.pages.retrieve({ page_id: elderId })) as any;

    // Check if published
    if (page.properties.Status?.select?.name !== 'Published') {
      return null;
    }

    const hwalseoRelation = page.properties.Hwalseo?.relation || [];
    const elderSlug = page.properties.Slug?.rich_text?.[0]?.plain_text || page.id.replaceAll('-', '');

    // 캐시에 저장
    if (page.properties.Slug?.rich_text?.[0]?.plain_text) {
      elderSlugCache.set(page.id, elderSlug);
    }

    return {
      id: page.id,
      name: page.properties.Name?.title?.[0]?.plain_text || '',
      slug: elderSlug,
      photo: getProxiedImageUrl(
        page.properties.Photo?.files?.[0]?.file?.url ||
          page.properties.Photo?.files?.[0]?.external?.url ||
          ''
      ),
      birthYear: page.properties.BirthYear?.number || undefined,
      gender: page.properties.Gender?.select?.name || undefined,
      region: page.properties.Region?.select?.name || undefined,
      introduction:
        page.properties.Introduction?.rich_text?.[0]?.plain_text || undefined,
      bio: page.properties.Bio?.rich_text?.[0]?.plain_text || undefined,
      status: page.properties.Status?.select?.name || 'Draft',
      hwalseoIds: hwalseoRelation.map((rel: any) => rel.id),
    };
  } catch (error) {
    console.error('Error fetching elder by ID:', error);
    return null;
  }
}

export async function getElderByName(name: string): Promise<Elder | null> {
  try {
    const response = await notion.databases.query({
      database_id: elderDbId,
      filter: {
        and: [
          {
            property: 'Name',
            title: {
              equals: name,
            },
          },
          {
            property: 'Status',
            select: {
              equals: 'Published',
            },
          },
        ],
      },
    });

    if (response.results.length === 0) {
      return null;
    }

    const page = response.results[0] as any;
    const hwalseoRelation = page.properties.Hwalseo?.relation || [];
    const elderSlug = page.properties.Slug?.rich_text?.[0]?.plain_text || page.id.replaceAll('-', '');

    // 캐시에 저장
    if (page.properties.Slug?.rich_text?.[0]?.plain_text) {
      elderSlugCache.set(page.id, elderSlug);
    }

    return {
      id: page.id,
      name: page.properties.Name?.title?.[0]?.plain_text || '',
      slug: elderSlug,
      photo: getProxiedImageUrl(
        page.properties.Photo?.files?.[0]?.file?.url ||
          page.properties.Photo?.files?.[0]?.external?.url ||
          ''
      ),
      birthYear: page.properties.BirthYear?.number || undefined,
      gender: page.properties.Gender?.select?.name || undefined,
      region: page.properties.Region?.select?.name || undefined,
      introduction:
        page.properties.Introduction?.rich_text?.[0]?.plain_text || undefined,
      bio: page.properties.Bio?.rich_text?.[0]?.plain_text || undefined,
      status: page.properties.Status?.select?.name || 'Draft',
      hwalseoIds: hwalseoRelation.map((rel: any) => rel.id),
    };
  } catch (error) {
    console.error('Error fetching elder by name:', error);
    return null;
  }
}

export async function getHwalseoByElderId(elderId: string): Promise<HwalseoCard[]> {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: 'Status',
            select: {
              equals: 'Published',
            },
          },
          {
            property: 'Elder',
            relation: {
              contains: elderId,
            },
          },
        ],
      },
      sorts: [
        {
          property: 'PublishedAt',
          direction: 'descending',
        },
      ],
    });

    // 어르신 슬러그 한 번만 가져오기 (같은 어르신의 활서들이므로)
    const elderSlug = await getElderSlugById(elderId);

    const hwalseoList = await Promise.all(
      response.results.map(async (page: any) => {
        let slug = page.properties.Slug?.rich_text?.[0]?.plain_text || '';

        if (!slug && elderSlug) {
          slug = generateHwalseoSlug(elderSlug, page.id);
        }

        return {
          id: page.id,
          slug,
          title: page.properties.Title?.title?.[0]?.plain_text || '',
          elderName: page.properties.ElderName?.rich_text?.[0]?.plain_text || '',
          elderId: page.properties.Elder?.relation?.[0]?.id || undefined,
          theme: page.properties.Theme?.select?.name || '',
          excerpt: page.properties.Excerpt?.rich_text?.[0]?.plain_text || '',
          coverImage: getProxiedImageUrl(
            page.cover?.external?.url || page.cover?.file?.url || ''
          ),
          publishedAt: page.properties.PublishedAt?.date?.start || '',
        };
      })
    );

    return hwalseoList;
  } catch (error) {
    console.error('Error fetching hwalseo by elder ID:', error);
    return [];
  }
}