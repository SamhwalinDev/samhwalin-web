import { getHwalseoList } from '@/lib/notion';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const hwalseos = await getHwalseoList();
    return NextResponse.json(hwalseos);
  } catch (error) {
    console.error('Failed to fetch hwalseos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hwalseos' }, 
      { status: 500 }
    );
  }
}