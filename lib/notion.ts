import { Client } from '@notionhq/client';
import type { Hwalseo, HwalseoCard } from '@/types';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const databaseId = process.env.NOTION_HWALSEO_DATABASE_ID!;
const donationDbId = process.env.NOTION_DONATION_DATABASE_ID!;
const settingsDbId = process.env.NOTION_SETTINGS_DATABASE_ID!;
const postcardDbId = process.env.NOTION_POSTCARD_DATABASE_ID!;

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

    return response.results.map((page: any) => ({
      id: page.id,
      slug: page.properties.Slug?.rich_text?.[0]?.plain_text || '',
      title: page.properties.Title?.title?.[0]?.plain_text || '',
      elderName: page.properties.ElderName?.rich_text?.[0]?.plain_text || '',
      theme: page.properties.Theme?.select?.name || '',
      excerpt: page.properties.Excerpt?.rich_text?.[0]?.plain_text || '',
      coverImage: page.cover?.external?.url || page.cover?.file?.url || '',
      publishedAt: page.properties.PublishedAt?.date?.start || '',
    }));
  } catch (error) {
    console.error('Error fetching hwalseo list:', error);
    return [];
  }
}

export async function getHwalseoBySlug(slug: string): Promise<Hwalseo | null> {
  try {
    const response = await notion.databases.query({
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

    if (response.results.length === 0) {
      return null;
    }

    const page: any = response.results[0];
    const content = await getPageContent(page.id);

    return {
      id: page.id,
      slug: page.properties.Slug?.rich_text?.[0]?.plain_text || '',
      title: page.properties.Title?.title?.[0]?.plain_text || '',
      elderName: page.properties.ElderName?.rich_text?.[0]?.plain_text || '',
      elderAge: page.properties.ElderAge?.number || '',
      theme: page.properties.Theme?.select?.name || '',
      excerpt: page.properties.Excerpt?.rich_text?.[0]?.plain_text || '',
      content: content,
      coverImage: page.cover?.external?.url || page.cover?.file?.url || '',
      publishedAt: page.properties.PublishedAt?.date?.start || '',
      createdAt: page.created_time,
      updatedAt: page.last_edited_time,
    };
  } catch (error) {
    console.error('Error fetching hwalseo by slug:', error);
    return null;
  }
}

async function getPageContent(pageId: string): Promise<string> {
  try {
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    });

    return blocksToMarkdown(blocks.results);
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
          return `## ${richTextToString(block.heading_1.rich_text)}`;
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
          const imageUrl = block.image?.file?.url || block.image?.external?.url || '';
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
  return richText.map((text) => text.plain_text).join('');
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

    return response.results
      .filter((page: any) => page.id !== currentId)
      .slice(0, limit)
      .map((page: any) => ({
        id: page.id,
        slug: page.properties.Slug?.rich_text?.[0]?.plain_text || '',
        title: page.properties.Title?.title?.[0]?.plain_text || '',
        elderName: page.properties.ElderName?.rich_text?.[0]?.plain_text || '',
        theme: page.properties.Theme?.select?.name || '',
        excerpt: page.properties.Excerpt?.rich_text?.[0]?.plain_text || '',
        coverImage: page.cover?.external?.url || page.cover?.file?.url || '',
        publishedAt: page.properties.PublishedAt?.date?.start || '',
      }));
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
    let donorCount = 0;
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
      donorCount += 1;

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