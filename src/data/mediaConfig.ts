/**
 * CENTRAL MEDIA CONFIGURATION for Mr Chai Wale
 * 
 * All media (gallery images, UPI QR codes, menu photos) live here.
 * The owner can easily swap or add image URLs without touching component code.
 * 
 * PERFORMANCE GUIDELINES:
 * - Put optimized external WebP URLs here (recommended).
 * - Keep each image under 120–150 KB, ~800–1200 px wide.
 * - For local files, put them in public/gallery/ and reference without a leading slash (e.g. 'gallery/chai.webp').
 * - Gallery handles 0 to 20+ images gracefully with zero layout shift and automatic lazy-loading.
 */

export interface MediaImage {
  id?: string;
  src: string; // External WebP/AVIF URL or public/ path without leading slash
  alt: string;
  width?: number; // Pre-calculated width to prevent layout shift (CLS)
  height?: number; // Pre-calculated height
}

export interface MediaConfig {
  /**
   * Cart Gallery Images:
   * Put optimized external WebP URLs here (recommended). Keep each image under 150 KB.
   * For local files put them in public/gallery/ and reference without leading slash.
   * Empty 'src' gracefully renders a theme placeholder tile with a cup icon.
   */
  gallery: MediaImage[];

  /**
   * Cart Video Tile:
   * Supports YouTube Shorts / videos (preferred) or compressed .mp4 in public/gallery.
   */
  video: {
    src: string;
    poster: string;
    youtubeUrl?: string;
  };

  /**
   * UPI QR Code:
   * Set to an image URL/path (e.g. 'upi-qr.webp' or external hosted image).
   * Leave empty '' to display the clean interactive counter QR placeholder.
   */
  upiQrImage: string;

  /**
   * Optional hero/brand banners or social preview images
   */
  branding?: {
    logoIcon?: string;
    heroIllustrationType: 'inline-svg'; // Keeps first paint under 2s on 4G without HTTP roundtrips
  };
}

export const mediaConfig: MediaConfig = {
  gallery: [
    {
      src: 'https://i.ibb.co/pv110TSD/IMG-20261013-WA0016-1.jpg',
      alt: 'Mr Chai Wale freshly brewed tea and snacks',
      width: 1200,
      height: 900,
    },
    {
      src: 'https://i.ibb.co/8n7PwTtR/1000091418.png',
      alt: 'Mr Chai Wale hot brewing kadai and ingredients',
      width: 1200,
      height: 900,
    },
    {
      src: 'https://i.ibb.co/WNvfZFsZ/1000091419.png',
      alt: 'Mr Chai Wale special snacks and chai counter',
      width: 1200,
      height: 900,
    },
    {
      src: 'https://i.ibb.co/6RFkZ6yx/1000091414.png',
      alt: 'Mr Chai Wale street cart morning moments',
      width: 1200,
      height: 900,
    },
  ],
  video: {
    src: '',
    poster: '',
    youtubeUrl: 'https://www.youtube.com/shorts/TVOevyn7mVo',
  },
  upiQrImage: 'https://i.ibb.co/fzqMNmTH/IMG-20261015-133347.jpg',
  branding: {
    heroIllustrationType: 'inline-svg',
  },
};

/**
 * Helper to resolve both external URLs (https://...) and local public/ paths.
 */
export function resolveAssetUrl(src?: string): string {
  if (!src) return '';
  const trimmed = src.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  // Strip leading slash if any, then prepend relative base
  const cleanPath = trimmed.replace(/^\/+/, '');
  return `./${cleanPath}`;
}
