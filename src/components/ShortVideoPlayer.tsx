import React, { useState } from 'react';
import { Play, Camera } from 'lucide-react';
import { resolveAssetUrl } from '../data/cart';

interface ShortVideoPlayerProps {
  youtubeId: string | null;
  videoSrc?: string;
  videoPoster?: string;
}

/**
 * Lightweight, high-performance 9:16 vertical video player for Mr Chai Wale:
 * - Facade view: Light external thumbnail + brand green round play button
 * - Zero scripts or iframes loaded before user interaction (saves huge mobile 4G data)
 * - On tap: loads standard lightweight YouTube embed with native controls (quality selector 360p/720p, fullscreen, volume)
 * - Zero layout shift with aspect-[9/16] wrapper
 */
export const ShortVideoPlayer: React.FC<ShortVideoPlayerProps> = ({
  youtubeId,
  videoSrc,
  videoPoster,
}) => {
  const [isStarted, setIsStarted] = useState(false);

  const cleanVideoSrc = videoSrc?.trim();
  const hasMp4 = Boolean(cleanVideoSrc);

  // Fallback placeholder if no YouTube ID and no MP4 source
  if (!youtubeId && !hasMp4) {
    return (
      <div className="w-full max-w-[360px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden border border-leaf-tint bg-leaf-soft shadow-xs flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-14 h-14 rounded-full bg-white border border-leaf-tint flex items-center justify-center text-leaf-ink mb-3 shadow-2xs">
          <Play className="w-6 h-6 fill-current text-leaf-ink ml-0.5" aria-hidden="true" />
        </div>
        <span className="text-sm font-bold text-ink mb-1">
          Video coming soon
        </span>
        <span className="text-xs text-body flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5" aria-hidden="true" />
          Cart Short
        </span>
      </div>
    );
  }

  // 1. Facade View: Light external poster + brand-green round play button
  // Zero iframes or scripts loaded until user clicks play
  if (!isStarted) {
    const posterUrl = youtubeId
      ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
      : videoPoster
      ? resolveAssetUrl(videoPoster)
      : '';

    return (
      <div className="w-full max-w-[360px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden border border-leaf-tint bg-slate-900 shadow-xs relative group select-none">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt="Mr Chai Wale short video preview"
            width={720}
            height={1280}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-102 transition-all duration-300"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-950" />
        )}

        {/* Soft contrast gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30 pointer-events-none" />

        {/* Centered Brand Green Play Button (min 48px tap target) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setIsStarted(true)}
            aria-label="Play video"
            className="w-16 h-16 min-w-[48px] min-h-[48px] rounded-full bg-leaf text-on-lemon flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform cursor-pointer border-2 border-white/80 focus-visible:ring-2 focus-visible:ring-leaf-ink"
          >
            <Play className="w-7 h-7 fill-current ml-0.5 text-on-lemon" aria-hidden="true" />
          </button>
        </div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
          <span className="text-xs font-bold uppercase tracking-wider bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
            Cart Reel
          </span>
          <span className="text-xs font-bold bg-leaf text-on-lemon px-2.5 py-1 rounded-full shadow-2xs">
            9:16 Short
          </span>
        </div>

        {/* Bottom Captions */}
        <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
          <p className="text-sm font-bold drop-shadow-md">
            Mr Chai Wale · Daily Moments
          </p>
          <p className="text-[11px] text-white/80 mt-0.5">
            Tap to watch fresh street brewing
          </p>
        </div>
      </div>
    );
  }

  // 2. Started View: Standard lightweight embed with native YouTube controls
  // Enables built-in quality selector (360p/720p), fullscreen, and volume with zero lag
  if (youtubeId) {
    const embedSrc = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;

    return (
      <div className="w-full max-w-[360px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden border border-leaf-tint bg-black shadow-lg relative">
        <iframe
          src={embedSrc}
          title="Mr Chai Wale video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  // MP4 Fallback with native HTML5 video controls
  return (
    <div className="w-full max-w-[360px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden border border-leaf-tint bg-black shadow-lg relative">
      <video
        controls
        playsInline
        autoPlay
        className="w-full h-full object-cover"
      >
        <source src={resolveAssetUrl(cleanVideoSrc!)} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
