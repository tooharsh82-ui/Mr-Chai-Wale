import React from 'react';
import { Megaphone } from 'lucide-react';
import { cartConfig } from '../data/cart';

export const NoticeBanner: React.FC = () => {
  const notice = cartConfig.hours.noticeText?.trim();
  if (!notice) return null;

  return (
    <aside 
      aria-label="Important cart notice"
      className="bg-leaf-soft border-b border-leaf-tint py-2.5 px-4 text-center text-sm font-medium text-leaf-ink"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
        <Megaphone className="w-4 h-4 text-leaf-ink shrink-0" aria-hidden="true" />
        <span>{notice}</span>
      </div>
    </aside>
  );
};
