import { Client } from '@notionhq/client';
import type {
  PageObjectResponse,
  BlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import type { Hwalseo, HwalseoCard, Elder, ElderCard, Question, QuestionInput } from '@/types';
import { getProxiedImageUrl } from './utils';

// ============================================
// Notion 타입 헬퍼
// ============================================

/**
 * Notion 페이지 프로퍼티에 안전하게 접근하기 위한 타입
 * Notion SDK의 복잡한 유니온 타입 대신 실용적인 접근 방식 사용
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NotionProperties = Record<string, any>;

type NotionPageWithProperties = PageObjectResponse & {
  properties: NotionProperties;
  cover?: {
    external?: { url: string };
    file?: { url: string };
  } | null;
};

/**
 * 블록을 마크다운으로 변환할 때 사용하는 타입
 */
type NotionBlock = BlockObjectResponse & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

/**
 * RichText 아이템 타입 (Notion API의 복잡한 유니온 타입 대신 실용적 접근)
 */
interface NotionRichTextItem {
  plain_text: string;
  text?: { content: string };
  href?: string | null;
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
}

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const databaseId = process.env.NOTION_HWALSEO_DATABASE_ID!;
const QUESTION_DB_ID = '2f2d1667aaa3801b9597fd85a6804be8';

// ============================================
// Slug 생성 헬퍼 함수
// ============================================

/**
 * Hwalseo ID와 Elder slug로 자동 slug 생성
 * - Elder slug가 있으면: {elder-slug}-{hwalseo-id-last-4}
 * - Elder slug가 없으면: {hwalseo-id-first-8} (fallback)
 */
function buildHwalseoSlug(elderSlug: string | null | undefined, hwalseoId: string): string {
  const cleanId = hwalseoId.replaceAll('-', '');
  if (elderSlug) {
    return `${elderSlug}-${cleanId.slice(-4).toLowerCase()}`;
  }
  return cleanId.slice(0, 8);
}

// Elder 데이터 캐시 (Elder ID -> { name, slug } 매핑)
const elderDataCache = new Map<string, { name: string; slug: string }>();

// ============================================
// HwalseoCard 매핑 헬퍼
// ============================================

/**
 * Notion 페이지를 HwalseoCard로 변환하는 헬퍼 함수
 * @param page - Notion 페이지 객체
 * @param elderData - Elder 데이터 (이름, slug)
 */
function pageToHwalseoCard(
  page: NotionPageWithProperties,
  elderData: { name: string; slug: string } | null
): HwalseoCard {
  const elderId = page.properties.Elder?.relation?.[0]?.id;
  const slug = buildHwalseoSlug(elderData?.slug, page.id);

  return {
    id: page.id,
    slug,
    title: page.properties.Title?.title?.[0]?.plain_text || '',
    elderName: elderData?.name || '',
    elderId,
    theme: page.properties.Theme?.select?.name || '',
    excerpt: page.properties.Excerpt?.rich_text?.[0]?.plain_text || '',
    coverImage: getProxiedImageUrl(page.cover?.external?.url || page.cover?.file?.url || ''),
    publishedAt: page.properties.PublishedAt?.date?.start || '',
  };
}

/**
 * Elder ID로 데이터 조회 (캐시 활용)
 */
async function getElderDataById(elderId: string): Promise<{ name: string; slug: string } | null> {
  if (elderDataCache.has(elderId)) {
    return elderDataCache.get(elderId)!;
  }

  try {
    const page = (await notion.pages.retrieve({ page_id: elderId })) as NotionPageWithProperties;
    const name = page.properties.Name?.title?.[0]?.plain_text || '';
    const slug = page.properties.Slug?.rich_text?.[0]?.plain_text ||
                 page.id.replaceAll('-', '').slice(0, 8);

    const data = { name, slug };
    elderDataCache.set(elderId, data);
    return data;
  } catch (error) {
    console.error('Error fetching elder data:', error);
    return null;
  }
}

/**
 * 여러 Elder ID를 배치로 조회 (N+1 쿼리 최적화)
 * 캐시에 있는 데이터는 재사용하고, 없는 것만 조회
 */
async function batchGetElderData(
  elderIds: string[]
): Promise<Map<string, { name: string; slug: string }>> {
  const result = new Map<string, { name: string; slug: string }>();
  const uncachedIds: string[] = [];

  // 1. 캐시에서 먼저 조회
  for (const id of elderIds) {
    if (elderDataCache.has(id)) {
      result.set(id, elderDataCache.get(id)!);
    } else {
      uncachedIds.push(id);
    }
  }

  // 2. 캐시에 없는 것만 병렬로 조회
  if (uncachedIds.length > 0) {
    const fetched = await Promise.all(
      uncachedIds.map(async (id) => {
        try {
          const page = (await notion.pages.retrieve({ page_id: id })) as NotionPageWithProperties;
          const name = page.properties.Name?.title?.[0]?.plain_text || '';
          const slug = page.properties.Slug?.rich_text?.[0]?.plain_text ||
                       page.id.replaceAll('-', '').slice(0, 8);
          return { id, data: { name, slug } };
        } catch (error) {
          console.error(`Error fetching elder ${id}:`, error);
          return { id, data: null };
        }
      })
    );

    // 3. 결과를 캐시와 result에 저장
    for (const { id, data } of fetched) {
      if (data) {
        elderDataCache.set(id, data);
        result.set(id, data);
      }
    }
  }

  return result;
}

const postcardDbId = process.env.NOTION_POSTCARD_DATABASE_ID!;
const subscriberDbId = process.env.NOTION_SUBSCRIBE_DATABASE_ID!;
const elderDbId = process.env.NOTION_ELDER_DATABASE_ID!;

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

    const pages = response.results as NotionPageWithProperties[];

    // 1. 모든 고유한 Elder ID 수집
    const elderIds = Array.from(
      new Set(
        pages
          .map((page) => page.properties.Elder?.relation?.[0]?.id)
          .filter((id): id is string => !!id)
      )
    );

    // 2. Elder 데이터 배치 조회 (N+1 → 1+1 쿼리로 최적화)
    const elderDataMap = await batchGetElderData(elderIds);

    // 3. 메모리에서 Elder 데이터를 매핑하여 HwalseoCard 생성
    return pages.map((page) => {
      const elderId = page.properties.Elder?.relation?.[0]?.id;
      const elderData = elderId ? elderDataMap.get(elderId) || null : null;
      return pageToHwalseoCard(page, elderData);
    });
  } catch (error) {
    console.error('Error fetching hwalseo list:', error);
    return [];
  }
}

export async function getHwalseoBySlug(slug: string): Promise<Hwalseo | null> {
  try {
    // slug 형식: {elder-slug}-{short-id} (마지막 4자가 hwalseo ID 끝부분)
    const lastHyphenIndex = slug.lastIndexOf('-');
    if (lastHyphenIndex <= 0) {
      return null;
    }

    const elderSlug = slug.slice(0, lastHyphenIndex);
    const shortId = slug.slice(lastHyphenIndex + 1);

    if (shortId.length !== 4) {
      return null;
    }

    // Elder를 slug로 찾기
    const elderResponse = await notion.databases.query({
      database_id: elderDbId,
      filter: {
        and: [
          {
            property: 'Slug',
            rich_text: {
              equals: elderSlug,
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

    if (elderResponse.results.length === 0) {
      return null;
    }

    const elder = elderResponse.results[0] as NotionPageWithProperties;

    // Elder의 Hwalseo 중에서 ID가 shortId로 끝나는 것 찾기
    const hwalseoRelation = elder.properties.Hwalseo?.relation || [];
    let page: NotionPageWithProperties | null = null;

    for (const rel of hwalseoRelation) {
      const cleanId = (rel.id as string).replaceAll('-', '');
      if (cleanId.slice(-4).toLowerCase() === shortId.toLowerCase()) {
        // 해당 Hwalseo 조회
        const hwalseoPage = await notion.pages.retrieve({ page_id: rel.id }) as NotionPageWithProperties;
        if (hwalseoPage.properties?.Status?.select?.name === 'Published') {
          page = hwalseoPage;
          break;
        }
      }
    }

    if (!page) {
      return null;
    }

    const coverImageUrl = page.cover?.external?.url || page.cover?.file?.url || '';
    const content = await getPageContent(page.id, coverImageUrl);
    const elderId = page.properties.Elder?.relation?.[0]?.id;

    // Elder 데이터 가져오기 (캐시됨)
    const elderData = elderId ? await getElderDataById(elderId) : null;
    
    // Elder 상세 정보 가져오기 (프로필 표시용)
    let elderFullData: Elder | null = null;
    if (elderId) {
      try {
        elderFullData = await getElderById(elderId);
      } catch (error) {
        console.error('Error fetching elder full data:', error);
      }
    }

    // slug는 항상 자동 생성
    const generatedSlug = elderData?.slug
      ? buildHwalseoSlug(elderData.slug, page.id)
      : slug;

    return {
      id: page.id,
      slug: generatedSlug,
      title: page.properties.Title?.title?.[0]?.plain_text || '',
      subtitle: page.properties.Subtitle?.rich_text?.[0]?.plain_text || undefined,
      elderName: elderData?.name || '',
      elderId,
      theme: page.properties.Theme?.select?.name || '',
      excerpt: page.properties.Excerpt?.rich_text?.[0]?.plain_text || '',
      content: content,
      coverImage: getProxiedImageUrl(coverImageUrl),
      publishedAt: page.properties.PublishedAt?.date?.start || '',
      createdAt: page.created_time,
      updatedAt: page.last_edited_time,
      
      // 스토리텔링 구조를 위한 새 필드들 (Notion DB에 없으면 undefined)
      hook: page.properties.Hook?.rich_text?.[0]?.plain_text || undefined,
      bio: page.properties.Bio?.rich_text?.[0]?.plain_text || undefined,
      keyTakeaway: page.properties.KeyTakeaway?.rich_text?.[0]?.plain_text || undefined,
      behind: page.properties.Behind?.rich_text?.[0]?.plain_text || undefined,
      toReader: page.properties.ToReader?.rich_text?.[0]?.plain_text || undefined,
      
      // 추가 메타데이터
      region: page.properties.Region?.rich_text?.[0]?.plain_text || undefined,
      readingTime: page.properties.ReadingTime?.number || undefined,
      likes: page.properties.Likes?.number || 0,
      
      // Elder 프로필 정보 (프로필 카드용)
      elder: elderFullData || undefined,
    };
  } catch (error) {
    console.error('Error fetching hwalseo by slug:', error);
    return null;
  }
}

async function getPageContent(pageId: string, coverImageUrl?: string): Promise<string> {
  try {
    // 커서 기반 페이지네이션으로 모든 블록 조회 (100개 이상 페이지 지원)
    const allBlocks: NotionBlock[] = [];
    let cursor: string | null = null;

    do {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        page_size: 100,
        ...(cursor ? { start_cursor: cursor } : {}),
      });

      allBlocks.push(...(response.results as NotionBlock[]));
      cursor = response.has_more ? response.next_cursor : null;
    } while (cursor);

    // Filter out first image if it matches cover image (avoid duplicate display)
    let filteredBlocks = allBlocks;
    if (coverImageUrl && filteredBlocks.length > 0) {
      const firstBlock = filteredBlocks[0];
      if (firstBlock.type === 'image') {
        const imageData = firstBlock.image as { file?: { url: string }; external?: { url: string } };
        const firstImageUrl = imageData?.file?.url || imageData?.external?.url || '';
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

function blocksToMarkdown(blocks: NotionBlock[]): string {
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
        case 'image': {
          const imgData = block.image as { file?: { url: string }; external?: { url: string }; caption?: Array<{ plain_text: string }> };
          const imageUrl = getProxiedImageUrl(imgData?.file?.url || imgData?.external?.url || '');
          const caption = imgData?.caption?.[0]?.plain_text || '';
          // ||| 구분자 사용 (URL에 포함되지 않는 문자)
          return `[IMG]${imageUrl}[/IMG]${caption ? `[CAP]${caption}[/CAP]` : ''}`;
        }
        default:
          return '';
      }
    })
    .filter(Boolean)
    .join('\n\n');
}

function richTextToString(richText: NotionRichTextItem[]): string {
  if (!richText || richText.length === 0) return '';
  return richText.map((item) => {
    let text = item.plain_text || item.text?.content || '';
    const annotations = item.annotations || {};

    // Apply formatting in order: code first (innermost), then other styles
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

    // Handle colors (text color and background/highlight)
    if (annotations.color && annotations.color !== 'default') {
      const color = annotations.color;
      if (color.includes('_background')) {
        // Background color = highlight
        text = `[HIGHLIGHT:${color.replace('_background', '')}]${text}[/HIGHLIGHT]`;
      } else {
        // Text color
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

    const pages = (response.results as NotionPageWithProperties[])
      .filter((page) => page.id !== currentId)
      .slice(0, limit);

    // 1. 모든 고유한 Elder ID 수집
    const elderIds = Array.from(
      new Set(
        pages
          .map((page) => page.properties.Elder?.relation?.[0]?.id)
          .filter((id): id is string => !!id)
      )
    );

    // 2. Elder 데이터 배치 조회
    const elderDataMap = await batchGetElderData(elderIds);

    // 3. 메모리에서 Elder 데이터를 매핑하여 HwalseoCard 생성
    return pages.map((page) => {
      const elderId = page.properties.Elder?.relation?.[0]?.id;
      const elderData = elderId ? elderDataMap.get(elderId) || null : null;
      return pageToHwalseoCard(page, elderData);
    });
  } catch (error) {
    console.error('Error fetching related hwalseos:', error);
    return [];
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

    // 현재 시간을 ISO 형식으로
    const subscribeAt = new Date().toISOString();

    // Source 값을 한국어로 매핑
    const sourceMap: Record<string, string> = {
      'homepage': '홈페이지',
      'footer': '푸터',
      'hwalseo': '활서페이지',
      '활서페이지': '활서페이지',
      '홈페이지': '홈페이지',
      '푸터': '푸터',
      '프로젝트소개': '프로젝트소개',
      '프로필페이지': '프로필페이지',
      '해답찾기': '해답찾기',
      'Q&A': 'Q&A',
    };
    const sourceValue = sourceMap[data.source] || '홈페이지';

    // Build properties object
    const properties: Record<string, unknown> = {
      // Title property - Email
      Email: {
        title: [{ text: { content: data.email } }],
      },
      // Date property - SubscribeAt
      SubscribeAt: {
        date: { start: subscribeAt },
      },
      // Rich text property - Source (rich_text 타입)
      Source: {
        rich_text: [
          {
            text: {
              content: sourceValue,
            },
          },
        ],
      },
      // Select property - Status (select 타입)
      Status: {
        select: { name: '활성' },
      },
    };

    // Add ElderId if provided (relation 타입)
    if (data.elderId) {
      properties.ElderId = {
        relation: [{ id: data.elderId }],
      };
    }

    const response = await notion.pages.create({
      parent: { database_id: subscriberDbId },
      properties: properties as Parameters<typeof notion.pages.create>[0]['properties'],
    });

    console.log('Subscriber created:', response.id);
    return { success: true };
  } catch (error) {
    console.error('Error creating subscriber:', error);
    const err = error as { body?: unknown; message?: string };
    console.error('Error details:', err?.body || err?.message || error);
    return { success: false, error: 'server_error' };
  }
}

// ============================================
// 어르신 관련 함수
// ============================================

export async function getElderList(): Promise<ElderCard[]> {
  try {
    // 1. Elder 목록과 Published Hwalseo 목록을 병렬로 조회 (N+1 → 2 쿼리로 최적화)
    const [elderResponse, hwalseoResponse] = await Promise.all([
      notion.databases.query({
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
      }),
      notion.databases.query({
        database_id: databaseId,
        filter: {
          property: 'Status',
          select: {
            equals: 'Published',
          },
        },
      }),
    ]);

    // 2. Elder별 Hwalseo 카운트를 메모리에서 계산
    const hwalseoCountByElder = new Map<string, number>();
    for (const result of hwalseoResponse.results) {
      const page = result as NotionPageWithProperties;
      const elderId = page.properties.Elder?.relation?.[0]?.id;
      if (elderId) {
        hwalseoCountByElder.set(elderId, (hwalseoCountByElder.get(elderId) || 0) + 1);
      }
    }

    // 3. Elder 데이터 매핑
    return elderResponse.results.map((result) => {
      const page = result as NotionPageWithProperties;
      const photoProperty = page.properties.Photo;
      const photoUrl =
        photoProperty?.files?.[0]?.file?.url ||
        photoProperty?.files?.[0]?.external?.url ||
        '';

      return {
        id: page.id,
        name: page.properties.Name?.title?.[0]?.plain_text || '',
        slug: page.id.replaceAll('-', ''),
        photo: getProxiedImageUrl(photoUrl),
        birthYear: page.properties.BirthYear?.number || undefined,
        gender: page.properties.Gender?.select?.name || undefined,
        region: page.properties.Region?.select?.name || undefined,
        introduction:
          page.properties.Introduction?.rich_text?.[0]?.plain_text || undefined,
        hwalseoCount: hwalseoCountByElder.get(page.id) || 0,
      };
    });
  } catch (error) {
    console.error('Error fetching elder list:', error);
    return [];
  }
}

export async function getElderById(elderId: string): Promise<Elder | null> {
  try {
    const page = (await notion.pages.retrieve({ page_id: elderId })) as NotionPageWithProperties;

    // Check if published
    if (page.properties.Status?.select?.name !== 'Published') {
      return null;
    }

    const hwalseoRelation = page.properties.Hwalseo?.relation || [];
    const slug = page.properties.Slug?.rich_text?.[0]?.plain_text ||
                 page.id.replaceAll('-', '');

    return {
      id: page.id,
      name: page.properties.Name?.title?.[0]?.plain_text || '',
      slug: slug,
      photo: getProxiedImageUrl(
        page.properties.Photo?.files?.[0]?.file?.url ||
          page.properties.Photo?.files?.[0]?.external?.url ||
          ''
      ),
      birthYear: page.properties.BirthYear?.number || undefined,
      gender: page.properties.Gender?.select?.name || undefined,
      region: page.properties.Region?.select?.name || 
              page.properties.Region?.rich_text?.[0]?.plain_text || undefined,
      introduction:
        page.properties.Introduction?.rich_text?.[0]?.plain_text || undefined,
      bio: page.properties.Bio?.rich_text?.[0]?.plain_text || undefined,
      quote: page.properties.Quote?.rich_text?.[0]?.plain_text || undefined,
      status: page.properties.Status?.select?.name || 'Draft',
      hwalseoIds: hwalseoRelation.map((rel: { id: string }) => rel.id),
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

    const page = response.results[0] as NotionPageWithProperties;
    const hwalseoRelation = page.properties.Hwalseo?.relation || [];

    return {
      id: page.id,
      name: page.properties.Name?.title?.[0]?.plain_text || '',
      slug: page.id.replaceAll('-', ''),
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
      quote: page.properties.Quote?.rich_text?.[0]?.plain_text || undefined,
      status: page.properties.Status?.select?.name || 'Draft',
      hwalseoIds: hwalseoRelation.map((rel: { id: string }) => rel.id),
    };
  } catch (error) {
    console.error('Error fetching elder by name:', error);
    return null;
  }
}

/**
 * Get elders who have quotes (for BeforeIDieBanner)
 */
export async function getEldersWithQuotes(): Promise<Elder[]> {
  try {
    const response = await notion.databases.query({
      database_id: elderDbId,
      filter: {
        and: [
          {
            property: 'Status',
            select: {
              equals: 'Published',
            },
          },
          {
            property: '명언',
            rich_text: {
              is_not_empty: true,
            },
          },
        ],
      },
      sorts: [
        {
          timestamp: 'created_time',
          direction: 'descending',
        },
      ],
    });

    return response.results
      .map((result) => {
        const page = result as NotionPageWithProperties;
        const hwalseoRelation = page.properties.Hwalseo?.relation || [];

        return {
          id: page.id,
          name: page.properties.Name?.title?.[0]?.plain_text || '',
          slug: page.id.replaceAll('-', ''),
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
          quote: page.properties['명언']?.rich_text?.[0]?.plain_text || undefined,
          status: page.properties.Status?.select?.name || 'Draft',
          hwalseoIds: hwalseoRelation.map((rel: { id: string }) => rel.id),
        };
      })
      .filter((elder) => elder.quote && elder.quote.trim().length > 0); // 빈 명언 필터링
  } catch (error) {
    console.error('Failed to fetch elders with quotes:', error);
    return [];
  }
}

export async function getHwalseoByElderId(elderId: string): Promise<HwalseoCard[]> {
  try {
    // Elder 데이터를 먼저 가져오기 (slug와 name 모두 필요)
    const elderData = await getElderDataById(elderId);

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

    return response.results.map((result) => {
      const page = result as NotionPageWithProperties;
      return pageToHwalseoCard(page, elderData);
    });
  } catch (error) {
    console.error('Error fetching hwalseo by elder ID:', error);
    return [];
  }
}

// ============================================
// Question Functions
// ============================================

/**
 * Get questions for a specific hwalseo (only public, answered ones)
 */
export async function getQuestionsByHwalseoId(hwalseoId: string): Promise<Question[]> {
  try {
    const response = await notion.databases.query({
      database_id: QUESTION_DB_ID,
      filter: {
        and: [
          {
            property: '활서',
            relation: {
              contains: hwalseoId,
            },
          },
          {
            property: '공개여부',
            checkbox: {
              equals: true,
            },
          },
          {
            property: '상태',
            select: {
              equals: '답변완료',
            },
          },
        ],
      },
      sorts: [
        {
          property: '생성일',
          direction: 'descending',
        },
      ],
    });

    return response.results.map((page) => {
      const p = page as NotionPageWithProperties;
      return {
        id: p.id,
        question: p.properties['질문']?.title?.[0]?.plain_text || '',
        nickname: p.properties['닉네임']?.rich_text?.[0]?.plain_text || '익명',
        hwalseoId: p.properties['활서']?.relation?.[0]?.id || '',
        elderId: p.properties['어르신']?.relation?.[0]?.id || '',
        answer: p.properties['답변']?.rich_text?.[0]?.plain_text || '',
        status: (p.properties['상태']?.select?.name as '대기중' | '답변완료') || '대기중',
        isPublic: p.properties['공개여부']?.checkbox || false,
        createdAt: p.properties['생성일']?.created_time || '',
      };
    });
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    return [];
  }
}

/**
 * Create a new question
 */
export async function createQuestion(input: QuestionInput): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const response = await notion.pages.create({
      parent: { database_id: QUESTION_DB_ID },
      properties: {
        '질문': {
          title: [{ text: { content: input.question } }],
        },
        '닉네임': {
          rich_text: [{ text: { content: input.nickname || '익명' } }],
        },
        '활서': {
          relation: [{ id: input.hwalseoId }],
        },
        ...(input.elderId && {
          '어르신': {
            relation: [{ id: input.elderId }],
          },
        }),
        '상태': {
          select: { name: '대기중' },
        },
        '공개여부': {
          checkbox: false,
        },
      },
    });

    return { success: true, id: response.id };
  } catch (error) {
    console.error('Failed to create question:', error);
    return { success: false, error: 'Failed to create question' };
  }
}

// ============================================
// Elder Count
// ============================================

/**
 * 발행된 Elder(프로필) 개수 가져오기
 */
export async function getElderCount(publishedOnly: boolean = true): Promise<number> {
  try {
    console.log(`Fetching elder count (publishedOnly=${publishedOnly}) with database ID:`, process.env.NOTION_ELDER_DATABASE_ID);
    
    const queryOptions: any = {
      database_id: process.env.NOTION_ELDER_DATABASE_ID!,
    };
    
    // 테스형용으로 호출될 때는 모든 프로필 카운트 (Published + Draft)
    if (publishedOnly) {
      queryOptions.filter = {
        property: 'Status',
        select: {
          equals: 'Published',
        },
      };
    }
    
    const response = await notion.databases.query(queryOptions);
    
    console.log(`Elder count response (publishedOnly=${publishedOnly}):`, {
      total: response.results.length,
      results: response.results.map((page: any) => ({
        id: page.id,
        status: page.properties?.Status?.select?.name
      }))
    });
    
    return response.results.length;
  } catch (error) {
    console.error('Failed to get elder count:', error);
    
    // 필터 없이 전체 개수로 fallback 시도
    try {
      console.log('Trying without filter (fallback)...');
      const fallbackResponse = await notion.databases.query({
        database_id: process.env.NOTION_ELDER_DATABASE_ID!,
      });
      console.log('Total elders (unfiltered):', fallbackResponse.results.length);
      return fallbackResponse.results.length;
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return 0;
    }
  }
}