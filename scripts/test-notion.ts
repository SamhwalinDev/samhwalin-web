/**
 * Notion API 연결 테스트 스크립트
 * 
 * 실행 방법:
 * 1. npm install
 * 2. npx ts-node scripts/test-notion.ts
 * 
 * 또는 .env.local 없이 직접 실행:
 * NOTION_API_KEY=xxx NOTION_HWALSEO_DATABASE_ID=yyy npx ts-node scripts/test-notion.ts
 */

import { Client } from '@notionhq/client';

// 환경 변수 또는 직접 입력
const NOTION_API_KEY = process.env.NOTION_API_KEY || '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';
const DATABASE_ID = process.env.NOTION_HWALSEO_DATABASE_ID || '2b9862004b7480bc9f9dc71646217b85';

const notion = new Client({ auth: NOTION_API_KEY });

async function testConnection() {
  console.log('🔌 Notion API 연결 테스트 시작...\n');

  try {
    // 1. 데이터베이스 정보 가져오기
    console.log('1️⃣ 데이터베이스 정보 조회...');
    const database = await notion.databases.retrieve({
      database_id: DATABASE_ID,
    });

    console.log('✅ 데이터베이스 연결 성공!');
    console.log(`   - 제목: ${(database as any).title?.[0]?.plain_text || '(제목 없음)'}`);
    console.log(`   - ID: ${database.id}`);
    console.log('');

    // 2. 속성(Properties) 확인
    console.log('2️⃣ 데이터베이스 속성 확인...');
    const properties = (database as any).properties;
    const requiredProps = ['Title', 'Slug', 'ElderName', 'ElderAge', 'Theme', 'Excerpt', 'Status', 'PublishedAt'];
    
    console.log('   현재 속성:');
    Object.keys(properties).forEach((key) => {
      const prop = properties[key];
      const isRequired = requiredProps.includes(key);
      const status = isRequired ? '✅' : '  ';
      console.log(`   ${status} ${key}: ${prop.type}`);
    });

    // 필수 속성 체크
    const missingProps = requiredProps.filter((prop) => !properties[prop]);
    if (missingProps.length > 0) {
      console.log('\n⚠️  누락된 필수 속성:', missingProps.join(', '));
      console.log('   위 속성들을 Notion 데이터베이스에 추가해주세요.');
    } else {
      console.log('\n✅ 모든 필수 속성이 존재합니다!');
    }
    console.log('');

    // 3. 데이터 조회 테스트
    console.log('3️⃣ 데이터 조회 테스트...');
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      page_size: 5,
    });

    console.log(`✅ ${response.results.length}개의 페이지를 찾았습니다.`);
    
    if (response.results.length > 0) {
      console.log('\n   📚 활서 목록:');
      response.results.forEach((page: any, index: number) => {
        const title = page.properties.Title?.title?.[0]?.plain_text || '(제목 없음)';
        const elderName = page.properties.ElderName?.rich_text?.[0]?.plain_text || '(이름 없음)';
        const status = page.properties.Status?.select?.name || '(상태 없음)';
        console.log(`   ${index + 1}. ${title} - ${elderName} [${status}]`);
      });
    } else {
      console.log('   💡 데이터베이스에 테스트 데이터를 추가해보세요.');
    }
    console.log('');

    // 4. 성공 메시지
    console.log('═'.repeat(50));
    console.log('🎉 Notion API 연결 테스트 완료!');
    console.log('═'.repeat(50));
    console.log('\n다음 단계:');
    console.log('1. .env.local 파일에 환경 변수 설정');
    console.log('2. npm run dev 실행');
    console.log('3. http://localhost:3000 에서 확인');

  } catch (error: any) {
    console.error('❌ 오류 발생:', error.message);
    
    if (error.code === 'unauthorized') {
      console.log('\n💡 해결 방법:');
      console.log('   - API 키가 올바른지 확인하세요');
      console.log('   - Integration이 활성화되어 있는지 확인하세요');
    } else if (error.code === 'object_not_found') {
      console.log('\n💡 해결 방법:');
      console.log('   - 데이터베이스 ID가 올바른지 확인하세요');
      console.log('   - 데이터베이스에 Integration을 연결했는지 확인하세요');
      console.log('   - Notion 페이지 우측 상단 ··· → 연결 → Integration 선택');
    }
    
    process.exit(1);
  }
}

// 실행
testConnection();
