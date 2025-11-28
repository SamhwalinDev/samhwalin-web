require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const donationDbId = process.env.NOTION_DONATION_DATABASE_ID;

async function testDonation() {
  // 한국 시간 기준 오늘
  const now = new Date();
  const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  const today = koreaTime.toISOString().split('T')[0];
  const thisMonth = today.slice(0, 7);
  
  console.log('=== 날짜 정보 ===');
  console.log('서버 시간:', now.toISOString());
  console.log('한국 시간 today:', today);
  console.log('이번달:', thisMonth);
  console.log('');

  const response = await notion.databases.query({
    database_id: donationDbId,
  });

  console.log('=== 후원 내역 ===');
  response.results.forEach((page, i) => {
    const name = page.properties.Name?.title?.[0]?.plain_text || '익명';
    const amount = page.properties.Amount?.number || 0;
    const dateStr = page.properties.Date?.date?.start || '날짜없음';
    
    const isToday = dateStr === today;
    const isThisMonth = dateStr.startsWith(thisMonth);
    
    console.log(`${i + 1}. ${name}: ${amount}원, 날짜: ${dateStr}`);
    console.log(`   - 오늘인가? ${isToday} (${dateStr} === ${today})`);
    console.log(`   - 이번달인가? ${isThisMonth}`);
    console.log('');
  });
}

testDonation().catch(console.error);
