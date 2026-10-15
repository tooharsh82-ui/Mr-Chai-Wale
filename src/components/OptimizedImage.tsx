import React, { useState } from 'react';
import { resolveAssetUrl } from '../data/cart';

interface OptimizedImageProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatioClass?: string;
  priority?: boolean;
  className?: string;
  fallback?: React.ReactNode;
  imgClassName?: string;
}

/**
 * High-performance image component optimized for low-end mobile & slow 4G:
 * - Prevents layout shift (CLS) via explicit aspect ratio & dimension wrappers
 * - loading="lazy" (or "eager" if priority)
 * - decoding="async"
 * - Graceful fallback on network failure or empty src
 * - Zero external animation libraries (uses lightweight GPU CSS transitions)
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  aspectRatioClass = 'aspect-[4/3]',
  priority = false,
  className = '',
  imgClassName = '',
  fallback,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const cleanSrc = src?.trim();
  const resolvedUrl = cleanSrc ? resolveAssetUrl(cleanSrc) : '';

  if (!resolvedUrl || hasError) {
    return <div className={`relative w-full ${aspectRatioClass} ${className}`}>{fallback}</div>;
  }

  return (
    <div
      className={`relative w-full overflow-hidden ${aspectRatioClass} ${className}`}
      style={width && height ? { aspectRatio: `${width} / ${height}` } : undefined}
    >
      {/* Soft placeholder background while downloading over slow 4G */}
      {!isLoaded && fallback && (
        <div className="absolute inset-0 z-0">
          {fallback}
        </div>
      )}

      <img
        src={resolvedUrl}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </div>
  );
};
