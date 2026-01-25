'use client';

export default function TestypeButton() {
  const handleClick = () => {
    alert('테스형 AI는 현재 준비 중입니다. 곧 만나요!');
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-4 rounded-2xl font-semibold hover:bg-primary hover:text-white transition-all"
    >
      테스형 만나기
    </button>
  );
}