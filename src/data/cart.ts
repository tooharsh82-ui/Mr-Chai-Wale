/**
 * CONFIG FILE for Mr Chai Wale
 * All editable content lives here and nowhere else.
 * 
 * Instructions:
 * - Update PHONE and WHATSAPP_NUMBER with your 10-12 digit numbers (e.g., "919876543210").
 *   If the value still contains "X", Call and WhatsApp buttons are automatically hidden.
 * - Set UPI_ID to your merchant or personal UPI handle (e.g. "mrchaiwale@okhdfcbank").
 *   If left empty, the Pay by UPI section is hidden.
 * - Set mapsUrl to your Google Maps embed or share URL. If empty, "Get Directions" and map iframe are hidden.
 * - Add or modify menu items in the sample list below.
 * - To show Today's Special, fill in todaysSpecial.title. If empty, the block is hidden.
 * - Put optimized .webp files (about 1200px wide, under 150 KB) in public/gallery and reference them in gallery.
 */

import { mediaConfig, MediaImage, resolveAssetUrl } from './mediaConfig';

export { mediaConfig, resolveAssetUrl };
export type { MediaImage };

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price?: number; // Optional: Show a price ONLY if it is defined
  veg?: boolean; // Optional: true = veg dot, false = non-veg dot, undefined = no dot
  image?: string; // Optional image URL (external WebP/AVIF or public/ path)
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface CartConfig {
  name: string;
  tagline: string;
  phone: string;
  displayPhone: string;
  telLink: string;
  whatsappNumber: string;
  email: string;
  upiId: string;
  upiQrImage?: string;
  instagramUrl: string;
  location: {
    landmark: string;
    area: string;
    city: string;
    address: string;
    mapsUrl: string;
    findTip: string;
  };
  hours: {
    open: string;
    close: string;
    days: number[];
    displayText: string;
    statusOverride: 'auto' | 'open' | 'closed';
    noticeText: string;
  };
  video: {
    src: string;
    poster: string;
    youtubeUrl?: string;
  };
  menu: MenuCategory[];
  todaysSpecial: {
    title: string;
    description: string;
    price?: number;
  };
  gallery: MediaImage[];
  reviews: Array<{
    id: string;
    author: string;
    comment: string;
    rating?: number;
  }>;
  whyUs: Array<{
    id: string;
    title: string;
    description: string;
    icon: 'flame' | 'leaf' | 'sparkles' | 'clock';
  }>;
  story: string;
  bulkOrder: {
    title: string;
    description: string;
    details: string[];
  };
  deliveryAvailable: boolean;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

/**
 * Parses a YouTube URL or ID into an 11-character video ID.
 * Accepts:
 * - youtube.com/shorts/ID
 * - youtube.com/watch?v=ID
 * - youtu.be/ID
 * - bare 11-character ID
 * Returns null for invalid or placeholder text (e.g. "PASTE_YOUR_SHORTS_LINK_HERE").
 */
export function getYoutubeId(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed || trimmed === 'PASTE_YOUR_SHORTS_LINK_HERE') return null;

  // Bare 11-character ID
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // youtube.com/shorts/ID
  const shortsMatch = trimmed.match(/(?:youtube\.com|youtu\.be)\/shorts\/([A-Za-z0-9_-]{11})/i);
  if (shortsMatch) return shortsMatch[1];

  // youtu.be/ID
  const youtuBeMatch = trimmed.match(/youtu\.be\/([A-Za-z0-9_-]{11})/i);
  if (youtuBeMatch) return youtuBeMatch[1];

  // youtube.com/watch?v=ID
  const watchMatch = trimmed.match(/[?&]v=([A-Za-z0-9_-]{11})/i);
  if (watchMatch) return watchMatch[1];

  // youtube.com/embed/ID
  const embedMatch = trimmed.match(/youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{11})/i);
  if (embedMatch) return embedMatch[1];

  return null;
}

export const cartConfig: CartConfig = {
  name: 'Mr Chai Wale',
  tagline: 'Garma Garam Chai, Seedha Cart Se',
  phone: '73807 93006',
  displayPhone: '73807 93006',
  telLink: '+917380793006',
  whatsappNumber: '917380793006',
  email: 'sainishivansh098@gmail.com',
  upiId: '', // Empty: Pay by UPI section stays hidden
  upiQrImage: mediaConfig.upiQrImage,
  instagramUrl: 'https://instagram.com/mr_chai_wale',
  location: {
    landmark: 'Beside AUV Krishna Hall, Kanpur Road, Alambagh',
    area: 'Alambagh, Lucknow',
    city: 'Lucknow',
    address: '551/91-55/3, Kanpur Rd, Om Nagar, Sujanpura, Alambagh, Lucknow, Uttar Pradesh 226005',
    mapsUrl: '', // Paste the Google Maps pin share link here to enable the map and Directions
    findTip: 'Look for the Mr Chai Wale cart on Kanpur Road, beside AUV Krishna Hall.',
  },
  hours: {
    open: '06:00',
    close: '00:00', // Treated as 24:00 (12:00 AM Midnight)
    days: [0, 1, 2, 3, 4, 5, 6], // Open all 7 days
    displayText: '6:00 AM – 12:00 AM (Midnight)',
    statusOverride: 'auto',
    noticeText: '',
  },
  video: {
    src: mediaConfig.video.src,
    poster: mediaConfig.video.poster,
    youtubeUrl: mediaConfig.video.youtubeUrl || 'https://www.youtube.com/shorts/TVOevyn7mVo',
  },
  menu: [
    {
      id: 'chai',
      name: 'Chai',
      items: [
        {
          id: 'adrak-chai-cutting',
          name: 'Adrak Chai · Cutting',
          description: 'Tandoori taste ♡',
          price: 7,
          veg: true,
        },
        {
          id: 'adrak-chai-glass',
          name: 'Adrak Chai · Glass',
          description: 'Tandoori taste ♡',
          price: 12,
          veg: true,
        },
        {
          id: 'adrak-chai-kulhad',
          name: 'Adrak Chai · Kulhad',
          description: 'Tandoori taste ♡',
          price: 18,
          veg: true,
        },
        {
          id: 'elaichi-tea-cutting',
          name: 'Elaichi Tea · Cutting',
          description: 'Rich flavour ♡',
          price: 10,
          veg: true,
        },
        {
          id: 'elaichi-tea-glass',
          name: 'Elaichi Tea · Glass',
          description: 'Rich flavour ♡',
          price: 15,
          veg: true,
        },
        {
          id: 'elaichi-tea-kulhad',
          name: 'Elaichi Tea · Kulhad',
          description: 'Rich flavour ♡',
          price: 20,
          veg: true,
        },
        {
          id: 'rose-tea-cutting',
          name: 'Rose Tea · Cutting',
          price: 10,
          veg: true,
        },
        {
          id: 'rose-tea-glass',
          name: 'Rose Tea · Glass',
          price: 15,
          veg: true,
        },
        {
          id: 'rose-tea-kulhad',
          name: 'Rose Tea · Kulhad',
          price: 20,
          veg: true,
        },
      ],
    },
    {
      id: 'coffee',
      name: 'Coffee',
      items: [
        {
          id: 'classic-hot-coffee',
          name: 'Classic Hot Coffee',
          veg: true,
        },
        {
          id: 'cappuccino-coffee',
          name: 'Cappuccino Coffee',
          veg: true,
        },
        {
          id: 'latte-coffee',
          name: 'Latte Coffee',
          veg: true,
        },
        {
          id: 'strong-black-coffee',
          name: 'Strong Black Coffee',
          veg: true,
        },
        {
          id: 'cold-coffee',
          name: 'Cold Coffee',
          veg: true,
        },
      ],
    },
    {
      id: 'momos',
      name: 'Momos',
      items: [
        {
          id: 'veg-momos',
          name: 'Veg Momos',
          veg: true,
        },
        {
          id: 'paneer-momos',
          name: 'Paneer Momos',
          veg: true,
        },
        {
          id: 'chicken-momos',
          name: 'Chicken Momos',
          veg: false,
        },
        {
          id: 'tandoori-momos',
          name: 'Tandoori Momos',
        },
        {
          id: 'schezwan-momos',
          name: 'Schezwan Momos',
        },
      ],
    },
    {
      id: 'sandwich',
      name: 'Sandwich',
      items: [
        {
          id: 'veg-sandwich',
          name: 'Veg Sandwich',
          veg: true,
        },
        {
          id: 'cheese-sandwich',
          name: 'Cheese Sandwich',
          veg: true,
        },
        {
          id: 'grill-sandwich',
          name: 'Grill Sandwich',
        },
        {
          id: 'club-sandwich',
          name: 'Club Sandwich',
        },
      ],
    },
    {
      id: 'maggi',
      name: 'Maggi',
      items: [
        {
          id: 'plain-maggi',
          name: 'Plain Maggi',
          price: 40,
          veg: true,
        },
        {
          id: 'vegetable-maggi',
          name: 'Vegetable Maggi',
          price: 50,
          veg: true,
        },
        {
          id: 'schezwan-maggi',
          name: 'Schezwan Maggi',
          price: 60,
          veg: true,
        },
      ],
    },
    {
      id: 'bun',
      name: 'Bun',
      items: [
        {
          id: 'maska-bun',
          name: 'Maska Bun',
          price: 30,
          veg: true,
        },
        {
          id: 'garlic-bun',
          name: 'Garlic Bun',
          price: 40,
          veg: true,
        },
      ],
    },
  ],
  todaysSpecial: {
    title: 'Rose Tea',
    description: "Today's special. Cutting ₹10 · Glass ₹15 · Kulhad ₹20.",
  },
  // Central Gallery: Put optimized external WebP URLs here (recommended). Keep each image under 150 KB. For local files put them in public/gallery/ and reference without leading slash.
  gallery: mediaConfig.gallery,
  reviews: [],
  whyUs: [
    {
      id: 'fresh-brew',
      title: 'Freshly Brewed Every Batch',
      description: 'Chai is made in small batches throughout the day, never kept sitting in a thermos for hours.',
      icon: 'flame',
    },
    {
      id: 'real-spices',
      title: 'Real Crushed Spices',
      description: 'We crush whole ginger roots and green cardamom pods by hand at the cart for every brew.',
      icon: 'leaf',
    },
    {
      id: 'kulhad-tradition',
      title: 'Desi Kulhad Experience',
      description: 'Natural clay kulhads enhance the earthy flavor of chai and are naturally biodegradable.',
      icon: 'sparkles',
    },
    {
      id: 'quick-service',
      title: 'Quick 2-Minute Service',
      description: 'Designed for commuters and office-goers who want great chai without long waiting.',
      icon: 'clock',
    },
  ],
  story:
    'Mr Chai Wale started with a simple belief: a street cart should serve tea made with the same honesty and care as a cup made at home. We stand at our cart every morning from sunrise, boiling full-cream milk with whole tea leaves and freshly pounded spices. No powders, no shortcuts—just honest, boiling hot street chai for hardworking folks.',
  bulkOrder: {
    title: 'Bulk & Office Tea Flasks',
    description:
      'Need piping hot chai for your office team, morning meeting, construction crew, or gathering? We prepare 5 to 50 cup thermal kettle pickups with cups and snacks packaged neatly.',
    details: [
      'Hot chai packed in spill-safe containers with paper cups & tissue',
      'Pairs with fresh Maska Bun, Garlic Bun, or snacks',
      'Pickup ready at your requested time',
    ],
  },
  deliveryAvailable: false,
  faqs: [
    {
      question: 'Where exactly is the cart located?',
      answer:
        'The cart is parked beside AUV Krishna Hall, Kanpur Road, Alambagh, Lucknow (551/91-55/3, Kanpur Rd, Om Nagar, Sujanpura, Alambagh). Look out for the Mr Chai Wale cart on Kanpur Road.',
    },
    {
      question: 'What are your operating hours?',
      answer:
        'We operate daily from 6:00 AM to 12:00 AM (Midnight). We are open on all days of the week including Sundays.',
    },
    {
      question: 'Can I order in advance and pick up?',
      answer:
        'Yes! You can choose your items and send a quick pickup order directly through WhatsApp on this website. We will keep your items ready when you arrive so you do not have to wait in line.',
    },
    {
      question: 'Do you accept UPI payments?',
      answer:
        'Yes, we accept Google Pay, PhonePe, Paytm, BHIM, and any UPI app. You can scan our cart QR code or send payment to our UPI ID on your phone.',
    },
    {
      question: 'Do you take bulk orders for offices or parties?',
      answer:
        'Yes! We fulfill bulk orders of 10 to 50+ cups along with hot maska buns or snacks for office meetings and small get-togethers. Message us on WhatsApp 30 minutes in advance.',
    },
    {
      question: 'Do you deliver to doorstep or tables?',
      answer:
        'We are a street food cart, not a restaurant, so we do not have table service or home delivery riders. All orders are for walk-up counter pickup right at the cart.',
    },
  ],
};
