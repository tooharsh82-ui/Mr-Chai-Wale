import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Camera } from 'lucide-react';
import { resolveAssetUrl } from '../data/cart';

interface ShortVideoPlayerProps {
  youtubeId: string | null;
  videoSrc?: string;
  videoPoster?: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const ShortVideoPlayer: React.FC<ShortVideoPlayerProps> = ({
  youtubeId,
  videoSrc,
  videoPoster,
}) => {
  const [isStarted, setIsStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [userActivityTick, setUserActivityTick] = useState(0);
  const [feedbackIcon, setFeedbackIcon] = useState<'play' | 'pause' | null>(null);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const progressTimerRef = useRef<any>(null);
  const controlsTimeoutRef = useRef<any>(null);

  const cleanVideoSrc = videoSrc?.trim();
  const hasMp4 = Boolean(cleanVideoSrc);

  // Send command to YouTube iframe via YT API or postMessage fallback
  const sendYtCommand = useCallback((func: string, args: any[] = []) => {
    if (ytPlayerRef.current && typeof ytPlayerRef.current[func] === 'function') {
      try {
        ytPlayerRef.current[func](...args);
        return;
      } catch {
        // Fall back to postMessage
      }
    }
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        '*'
      );
    }
  }, []);

  // Initialize YouTube IFrame API when started
  useEffect(() => {
    if (!isStarted || !youtubeId) return;

    let isSubscribed = true;

    const setupPlayer = () => {
      if (!isSubscribed || !window.YT || !window.YT.Player) return;

      try {
        ytPlayerRef.current = new window.YT.Player('chai-yt-iframe', {
          events: {
            onReady: (event: any) => {
              if (!isSubscribed) return;
              try {
                event.target.playVideo();
                setIsPlaying(true);
              } catch {}
            },
            onStateChange: (event: any) => {
              if (!isSubscribed) return;
              // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                setIsPlaying(false);
                setProgress(0);
              }
            },
          },
        });
      } catch {
        // Player will operate via postMessage
      }
    };

    if (window.YT && window.YT.Player) {
      setupPlayer();
    } else {
      if (!document.getElementById('yt-iframe-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === 'function') prevCallback();
        setupPlayer();
      };
    }

    return () => {
      isSubscribed = false;
      if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
        try {
          ytPlayerRef.current.destroy();
        } catch {}
        ytPlayerRef.current = null;
      }
    };
  }, [isStarted, youtubeId]);

  // Track progress while playing
  useEffect(() => {
    if (!isStarted) return;

    if (youtubeId) {
      if (isPlaying) {
        progressTimerRef.current = setInterval(() => {
          if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
            try {
              const current = ytPlayerRef.current.getCurrentTime() || 0;
              const duration = ytPlayerRef.current.getDuration() || 1;
              if (duration > 0) {
                setProgress(Math.min(100, Math.max(0, (current / duration) * 100)));
              }
            } catch {}
          }
        }, 250);
      } else {
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      }
    }

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isStarted, isPlaying, youtubeId]);

  // Auto fade-out controls after 2s while playing
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      return;
    }

    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);

    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);

    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying, userActivityTick]);

  const triggerFeedback = (icon: 'play' | 'pause') => {
    setFeedbackIcon(icon);
    setTimeout(() => {
      setFeedbackIcon(null);
    }, 500);
  };

  const togglePlay = () => {
    setUserActivityTick((t) => t + 1);
    if (youtubeId) {
      if (isPlaying) {
        sendYtCommand('pauseVideo');
        setIsPlaying(false);
        triggerFeedback('pause');
      } else {
        sendYtCommand('playVideo');
        setIsPlaying(true);
        triggerFeedback('play');
      }
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        triggerFeedback('pause');
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        triggerFeedback('play');
      }
    }
  };

  const toggleMute = () => {
    setUserActivityTick((t) => t + 1);
    if (youtubeId) {
      if (isMuted) {
        sendYtCommand('unMute');
        setIsMuted(false);
      } else {
        sendYtCommand('mute');
        setIsMuted(true);
      }
    } else if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setUserActivityTick((t) => t + 1);
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));

    if (youtubeId) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.getDuration === 'function') {
        try {
          const duration = ytPlayerRef.current.getDuration() || 0;
          sendYtCommand('seekTo', [pct * duration, true]);
          setProgress(pct * 100);
        } catch {}
      }
    } else if (videoRef.current) {
      videoRef.current.currentTime = pct * (videoRef.current.duration || 0);
      setProgress(pct * 100);
    }
  };

  const handleStart = () => {
    setIsStarted(true);
    setIsPlaying(true);
    setUserActivityTick((t) => t + 1);
  };

  // If no youtubeId and no videoSrc, show clean placeholder
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

  // Facade view (Thumbnail + custom round green play button)
  if (!isStarted) {
    const posterUrl = youtubeId
      ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
      : videoPoster ? resolveAssetUrl(videoPoster) : '';

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
            className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-95 group-hover:scale-102 transition-all duration-300"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-950" />
        )}

        {/* Contrast overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30 pointer-events-none" />

        {/* Centered custom green round play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            onClick={handleStart}
            aria-label="Play video"
            className="w-16 h-16 min-w-[48px] min-h-[48px] rounded-full bg-leaf text-on-lemon flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform cursor-pointer border-2 border-white/60 focus-visible:ring-2 focus-visible:ring-leaf-ink"
          >
            <Play className="w-7 h-7 fill-current ml-0.5 text-on-lemon" aria-hidden="true" />
          </button>
        </div>

        {/* Top & Bottom Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
          <span className="text-xs font-bold uppercase tracking-wider bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
            Cart Reel
          </span>
          <span className="text-xs font-bold bg-leaf text-on-lemon px-2.5 py-1 rounded-full shadow-2xs">
            9:16 Short
          </span>
        </div>

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

  // Active Player view (YouTube iframe or MP4 with custom Green + White controls)
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const embedUrl = youtubeId
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}?enablejsapi=1&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&fs=0&disablekb=1&autoplay=1&origin=${encodeURIComponent(origin)}`
    : '';

  return (
    <div
      className="w-full max-w-[360px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden border border-leaf-tint bg-black shadow-lg relative select-none group"
      onMouseMove={() => setUserActivityTick((t) => t + 1)}
      onTouchStart={() => setUserActivityTick((t) => t + 1)}
    >
      {/* Video Content */}
      {youtubeId ? (
        <iframe
          ref={iframeRef}
          id="chai-yt-iframe"
          src={embedUrl}
          title="Mr Chai Wale video"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 w-full h-full border-0 pointer-events-none scale-[1.02]"
        />
      ) : (
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted={isMuted}
          onTimeUpdate={() => {
            if (videoRef.current) {
              const current = videoRef.current.currentTime || 0;
              const duration = videoRef.current.duration || 1;
              setProgress((current / duration) * 100);
            }
          }}
          onEnded={() => {
            setIsPlaying(false);
            setProgress(0);
          }}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={resolveAssetUrl(cleanVideoSrc!)} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Transparent Click Overlay: Captures video tap to play/pause */}
      <div
        className="absolute inset-0 z-20 cursor-pointer"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            togglePlay();
          }
        }}
      />

      {/* Quick Center Flash Feedback Icon */}
      {feedbackIcon && (
        <div className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none animate-ping duration-300">
          <div className="w-16 h-16 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs">
            {feedbackIcon === 'play' ? (
              <Play className="w-8 h-8 fill-white ml-1" />
            ) : (
              <Pause className="w-8 h-8 fill-white" />
            )}
          </div>
        </div>
      )}

      {/* Custom Clean Controls Overlay (Green + White Theme Only) */}
      <div
        className={`absolute inset-x-0 bottom-0 z-30 p-3 sm:p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col gap-2.5 transition-opacity duration-300 ${
          showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Thin Progress Bar (Green fill, White track) */}
        <div
          className="w-full h-1.5 bg-white/40 hover:h-2 rounded-full cursor-pointer relative transition-all overflow-hidden"
          onClick={handleSeek}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-leaf rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            {/* Play / Pause Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-white/20 hover:bg-white/35 text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-leaf"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-white" aria-hidden="true" />
              ) : (
                <Play className="w-4 h-4 fill-white ml-0.5" aria-hidden="true" />
              )}
            </button>

            {/* Mute / Unmute Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-white/20 hover:bg-white/35 text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-leaf"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white" aria-hidden="true" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Clean Branded Badge (Green & White) */}
          <span className="text-[11px] font-bold uppercase tracking-wider text-leaf bg-black/50 px-2.5 py-1 rounded-full border border-leaf/40">
            Mr Chai Wale
          </span>
        </div>
      </div>
    </div>
  );
};
