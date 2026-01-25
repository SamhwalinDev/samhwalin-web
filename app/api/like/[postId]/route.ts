import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = params.postId;
    
    // Get current likes from Notion
    const page = await notion.pages.retrieve({ page_id: postId });
    const currentLikes = (page as any).properties?.Likes?.number || 0;
    
    // Update likes count
    await notion.pages.update({
      page_id: postId,
      properties: {
        Likes: {
          number: currentLikes + 1,
        },
      },
    });
    
    return NextResponse.json({ likes: currentLikes + 1 });
  } catch (error) {
    console.error('Failed to update likes:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}