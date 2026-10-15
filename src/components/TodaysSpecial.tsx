import React from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { cartConfig } from '../data/cart';

interface TodaysSpecialProps {
  onAddSpecial?: () => void;
}

export const TodaysSpecial: React.FC<TodaysSpecialProps> = ({ onAddSpecial }) => {
  const special = cartConfig.todaysSpecial;
  if (!special || !special.title?.trim()) {
    return null;
  }

  return (
    <section className="bg-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="reveal-init bg-leaf-soft border-2 border-leaf rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          {/* Subtle decorative leaf accent */}
          <div 
            className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-leaf-tint opacity-50 pointer-events-none" 
            aria-hidden="true" 
          />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf text-on-lemon text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Aaj Ka Special · Cart Special</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-ink leading-snug">
                {special.title}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-body leading-relaxed">
                {special.description}
              </p>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 shrink-0">
              {typeof special.price === 'number' && (
                <div className="text-left sm:text-right">
                  <span className="text-xs text-leaf-ink font-semibold uppercase block">
                    Special Combo
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-ink">
                    ₹{special.price}
                  </span>
                </div>
              )}

              {onAddSpecial ? (
                <button
                  type="button"
                  onClick={onAddSpecial}
                  className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 text-sm font-semibold text-on-lemon bg-lemon hover:bg-lemon-dark rounded-xl transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-leaf-ink cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-1.5" aria-hidden="true" />
                  Order in Menu
                </button>
              ) : (
                <a
                  href="#menu"
                  className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 text-sm font-semibold text-on-lemon bg-lemon hover:bg-lemon-dark rounded-xl transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-leaf-ink"
                >
                  Order in Menu
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
