import { NextResponse } from 'next/server';
import { getElderCount } from '@/lib/notion';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const elderCount = await getElderCount();
    
    // Visitor count placeholder - update periodically or implement GA4 Data API later
    const visitorCount = 1000;
    
    return NextResponse.json({
      elderCount,
      visitorCount,
      success: true,
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { success: false, elderCount: 0, visitorCount: 1000 },
      { status: 500 }
    );
  }
}
