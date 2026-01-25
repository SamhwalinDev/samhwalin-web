'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
}

export default function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    if (isLiked || isLoading) return;

    // 애니메이션 시작
    setIsAnimating(true);
    setIsLoading(true);
    
    try {
      // Call API to update Notion
      const res = await fetch(`/api/like/${postId}`, {
        method: 'POST',
      });
      
      if (res.ok) {
        const data = await res.json();
        setLikeCount(data.likes);
        setIsLiked(true);
        
        // localStorage에 저장
        if (isClient) {
          localStorage.setItem(storageKey, 'true');
        }
      } else {
        // API 실패 시 로컬만 업데이트 (fallback)
        setLikeCount(prev => prev + 1);
        setIsLiked(true);
        if (isClient) {
          localStorage.setItem(storageKey, 'true');
        }
      }
    } catch (error) {
      console.error('Failed to like:', error);
      // 에러 발생 시에도 로컬 업데이트 (fallback)
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
      if (isClient) {
        localStorage.setItem(storageKey, 'true');
      }
    } finally {
      setIsLoading(false);
      // 애니메이션 종료
      setTimeout(() => {
        setIsAnimating(false);
      }, 200);
    }
  };

  // 좋아요 텍스트 생성
  const getLikeText = () => {
    if (isLoading) {
      return '...';
    }
    if (likeCount === 0) {
      return '공감하기';
    }
    return `${likeCount}명이 공감했어요`;
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLiked || isLoading}
      className={`
        flex items-center gap-2 px-6 py-3 rounded-full font-medium 
        transition-all duration-200 disabled:cursor-default
        ${isLiked 
          ? 'bg-red-50 text-red-500 cursor-default' 
          : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500 cursor-pointer'
        }
        ${isAnimating ? 'animate-pulse' : ''}
      `}
      aria-label={isLiked ? '이미 공감한 게시글입니다' : '이 게시글에 공감하기'}
    >
      <Heart 
        className={`
          w-5 h-5 transition-all duration-200
          ${isAnimating ? 'scale-125' : 'scale-100'}
        `}
        fill={isLiked ? 'currentColor' : 'none'}
      />
      <span className="text-sm font-medium">
        {getLikeText()}
      </span>
    </button>
  );
}