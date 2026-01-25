'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  postId: string;
  initialLikes?: number;
}

export default function LikeButton({ postId, initialLikes = 0 }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // localStorage 키
  const storageKey = `liked_${postId}`;

  // 클라이언트 사이드에서만 localStorage 접근
  useEffect(() => {
    setIsClient(true);
    
    // localStorage에서 좋아요 상태 확인
    const savedLiked = localStorage.getItem(storageKey);
    if (savedLiked === 'true') {
      setIsLiked(true);
    }
  }, [storageKey]);

  const handleLike = async () => {
    // 이미 좋아요를 눌렀다면 리턴
    if (isLiked) return;

    // 애니메이션 시작
    setIsAnimating(true);
    
    // 상태 업데이트
    setIsLiked(true);
    setLikeCount(prev => prev + 1);
    
    // localStorage에 저장
    if (isClient) {
      localStorage.setItem(storageKey, 'true');
    }

    // 애니메이션 종료
    setTimeout(() => {
      setIsAnimating(false);
    }, 200);
  };

  // 좋아요 텍스트 생성
  const getLikeText = () => {
    if (likeCount === 0) {
      return '공감하기';
    }
    return `${likeCount}명이 공감했어요`;
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLiked}
      className={`
        btn-like 
        ${isLiked ? 'btn-like-active' : 'btn-like-inactive'}
        ${isAnimating ? 'animate-pulse' : ''}
        ${isLiked ? 'cursor-default' : 'cursor-pointer'}
      `}
      aria-label={isLiked ? '이미 공감한 게시글입니다' : '이 게시글에 공감하기'}
    >
      <Heart 
        size={18} 
        className={`
          transition-all duration-200
          ${isAnimating ? 'scale-125' : 'scale-100'}
          ${isLiked ? 'text-orange-500' : ''}
        `}
        fill={isLiked ? 'currentColor' : 'none'}
      />
      <span className="text-sm font-medium">
        {getLikeText()}
      </span>
    </button>
  );
}