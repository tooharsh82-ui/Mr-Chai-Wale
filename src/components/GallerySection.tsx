import React, { useState, useEffect } from 'react';
import { Coffee, Camera, X, ZoomIn } from 'lucide-react';
import { cartConfig, resolveAssetUrl, getYoutubeId, MediaImage } from '../data/cart';
import { OptimizedImage } from './OptimizedImage';
import { ShortVideoPlayer } from './ShortVideoPlayer';

/**
 * Gallery Section (Cart Moments)
 * - 4 Clickable photo tiles with lightbox zoom modal
 * - 9:16 Vertical Short video player with facade & custom green+white controls
 */
export const GallerySection: React.FC = () => {
  const rawItems = cartConfig.gallery;
  const items = rawItems && rawItems.length > 0
    ? rawItems.slice(0, 4)
    : Array.from({ length: 4 }).map((_, i) => ({
        src: '',
        alt: `Mr Chai Wale cart photo ${i + 1}`,
        width: 1200,
        height: 900,
      }));

  const video = cartConfig.video || { src: '', poster: '' };
  const youtubeId = getYoutubeId(video.youtubeUrl);

  const [activeLightboxImage, setActiveLightboxImage] = useState<MediaImage | null>(null);

  // Close lightbox on Escape key
  useEffect(() => {
    if (!activeLightboxImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveLightboxImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxImage]);

  return (
    <section id="gallery" className="reveal-init scroll-mt-16 py-14 bg-leaf-soft border-t border-leaf-tint">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-leaf-ink bg-white border border-leaf-tint px-3 py-1 rounded-full inline-block mb-2">
            Cart Moments
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Fresh from the Kadai &amp; Kettle
          </h2>
          <p className="mt-1 text-sm sm:text-base text-body">
            Glimpses of daily tea brewing, crisp snacks, and street morning scenes. Tap any photo to enlarge.
          </p>
        </div>

        {/* 4 Photo Tiles Grid (2 cols mobile, 4 cols desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {items.map((item, index) => {
            const hasImage = Boolean(item.src?.trim());
            const placeholderFallback = (
              <div 
                className="w-full h-full flex flex-col items-center justify-center p-3 text-center select-none bg-leaf-soft"
                aria-label={item.alt || 'Cart visual placeholder'}
              >
                <div className="w-10 h-10 rounded-full bg-white border border-leaf-tint flex items-center justify-center text-leaf-ink mb-1.5 shadow-2xs">
                  <Coffee className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-[11px] font-semibold text-leaf-ink px-1 line-clamp-2">
                  {item.alt || 'Mr Chai Wale Special'}
                </span>
                <span className="text-[9px] text-body mt-0.5 flex items-center gap-1">
                  <Camera className="w-2.5 h-2.5" aria-hidden="true" />
                  Cart snap
                </span>
              </div>
            );

            return (
              <div
                key={index}
                className="relative rounded-2xl overflow-hidden border border-leaf-tint bg-white shadow-xs group"
              >
                {hasImage ? (
                  <button
                    type="button"
                    onClick={() => setActiveLightboxImage(item)}
                    className="w-full h-full text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-leaf-ink block relative"
                    aria-label={`View photo ${index + 1}: ${item.alt}`}
                  >
                    <OptimizedImage
                      src={item.src}
                      alt={item.alt || `Cart photo ${index + 1}`}
                      width={item.width || 1200}
                      height={item.height || 900}
                      aspectRatioClass="aspect-[4/3]"
                      priority={index < 2}
                      imgClassName="transition-transform duration-300 group-hover:scale-105"
                      fallback={placeholderFallback}
                    />
                    {/* Hover zoom indicator overlay */}
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <div className="w-9 h-9 rounded-full bg-white/90 text-ink flex items-center justify-center shadow-md">
                        <ZoomIn className="w-4 h-4 text-leaf-ink" aria-hidden="true" />
                      </div>
                    </div>
                  </button>
                ) : (
                  <OptimizedImage
                    src={item.src}
                    alt={item.alt || `Cart photo ${index + 1}`}
                    width={item.width || 1200}
                    height={item.height || 900}
                    aspectRatioClass="aspect-[4/3]"
                    priority={index < 2}
                    fallback={placeholderFallback}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Vertical 9:16 Short Video Feature */}
        <div className="mt-12">
          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-leaf-ink bg-white border border-leaf-tint px-3 py-1 rounded-full inline-block mb-1.5">
              Cart Reel
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
              Daily Moments in Action
            </h3>
          </div>

          <ShortVideoPlayer
            youtubeId={youtubeId}
            videoSrc={video.src}
            videoPoster={video.poster}
          />
        </div>
      </div>

      {/* Lightbox Modal for Clicked Image */}
      {activeLightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setActiveLightboxImage(null)}
        >
          {/* Close button with min 44px tap target */}
          <button
            type="button"
            onClick={() => setActiveLightboxImage(null)}
            className="absolute top-4 right-4 z-50 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-leaf"
            aria-label="Close image preview"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>

          {/* Modal Container */}
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={resolveAssetUrl(activeLightboxImage.src)}
              alt={activeLightboxImage.alt}
              loading="lazy"
              decoding="async"
              className="max-h-[80vh] max-w-[95vw] sm:max-w-4xl object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            {activeLightboxImage.alt && (
              <p className="mt-3 text-xs sm:text-sm font-medium text-white/90 text-center max-w-xl px-4 select-none">
                {activeLightboxImage.alt}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
