const { Client } = require('@notionhq/client');

const NOTION_API_KEY = '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';
const DATABASE_ID = '2b9862004b7480bc9f9dc71646217b85';

const notion = new Client({ auth: NOTION_API_KEY });

async function debug() {
  console.log('🔍 Notion 데이터 상세 디버깅\n');

  const allPages = await notion.databases.query({ database_id: DATABASE_ID });
  console.log(`총 ${allPages.results.length}개 페이지 발견\n`);

  allPages.results.forEach((page, index) => {
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📄 페이지 ${index + 1}`);
    const props = page.properties;
    
    Object.keys(props).forEach(key => {
      const prop = props[key];
      let value = '(빈 값)';
      
      if (prop.type === 'title' && prop.title?.[0]) value = prop.title[0].plain_text;
      else if (prop.type === 'rich_text' && prop.rich_text?.[0]) value = prop.rich_text[0].plain_text;
      else if (prop.type === 'select' && prop.select) value = prop.select.name;
      else if (prop.type === 'number' && prop.number !== null) value = prop.number;
      else if (prop.type === 'date' && prop.date) value = prop.date.start;
      
      console.log(`   ${key} (${prop.type}): ${value}`);
    });
  });

  console.log('\n📌 Status 값 확인:');
  allPages.results.forEach((page, i) => {
    const status = page.properties.Status?.select?.name || '(없음)';
    const title = page.properties.Title?.title?.[0]?.plain_text || '(제목 없음)';
    console.log(`   ${i + 1}. "${title}" → Status: "${status}"`);
  });
}

debug();
