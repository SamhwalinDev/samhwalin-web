'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';

interface ProxiedImageProps extends Omit<ImageProps, 'src' | 'fill'> {
  src: string;
  fill?: boolean;
}

/**
 * Image component that handles proxied images correctly.
 * For images going through our /api/image proxy:
 * - Short URLs (<1500 chars): Use native <img> with GET
 * - Long URLs (>=1500 chars): Fetch via POST and use blob URL
 */
export function ProxiedImage({
  src,
  alt,
  fill,
  className,
  sizes,
  ...props
}: ProxiedImageProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if this is a proxied URL
  const isProxied = src.startsWith('/api/image');

  // Extract the original URL from proxy URL to check length
  const getOriginalUrl = (proxySrc: string): string | null => {
    try {
      const urlParam = new URL(proxySrc, 'http://localhost').searchParams.get(
        'url'
      );
      return urlParam ? decodeURIComponent(urlParam) : null;
    } catch {
      return null;
    }
  };

  const originalUrl = isProxied ? getOriginalUrl(src) : null;
  const isLongUrl = originalUrl && originalUrl.length >= 1500;

  useEffect(() => {
    if (!isProxied || !isLongUrl || !originalUrl) return;

    let cancelled = false;
    setLoading(true);

    const fetchImage = async () => {
      try {
        const response = await fetch('/api/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: originalUrl }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const blob = await response.blob();
        if (!cancelled) {
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
          setLoading(false);
        }
      } catch (err) {
        console.error('[ProxiedImage] POST fetch failed:', err);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      cancelled = true;
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, isProxied, isLongUrl, originalUrl]);

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  if (isProxied) {
    const fillClasses = fill ? 'absolute inset-0 w-full h-full object-cover' : '';
    const combinedClassName = `${className || ''} ${fillClasses}`.trim();

    // Loading state
    if (isLongUrl && loading) {
      return (
        <div
          className={`${combinedClassName} bg-gray-100 animate-pulse`}
          aria-label={alt?.toString() || 'Loading image'}
        />
      );
    }

    // Error state
    if (isLongUrl && error) {
      return (
        <div
          className={`${combinedClassName} bg-gray-200 flex items-center justify-center`}
          aria-label={alt?.toString() || 'Image failed to load'}
        >
          <span className="text-gray-400 text-4xl">📷</span>
        </div>
      );
    }

    // For long URLs, use blob URL from POST request
    if (isLongUrl && blobUrl) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={blobUrl}
          alt={alt?.toString() || ''}
          className={combinedClassName}
          loading="lazy"
        />
      );
    }

    // For short URLs, use GET directly
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt?.toString() || ''}
        className={combinedClassName}
        loading="lazy"
      />
    );
  }

  // For non-proxied images, use Next.js Image
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      {...props}
    />
  );
}
