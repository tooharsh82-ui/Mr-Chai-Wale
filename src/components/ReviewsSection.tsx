import React from 'react';
import { Star } from 'lucide-react';
import { cartConfig } from '../data/cart';

/**
 * Reviews Section
 * NOTE: Auto-hidden when reviews array is empty in src/data/cart.ts.
 * We never fabricate customer reviews or ratings.
 */
export const ReviewsSection: React.FC = () => {
  const reviews = cartConfig.reviews;

  // Strict auto-hide when empty
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section id="reviews" className="scroll-mt-16 py-14 bg-white border-t border-leaf-tint">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-leaf-ink bg-leaf-soft border border-leaf-tint px-3 py-1 rounded-full inline-block mb-2">
            Customer Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            What Regulars Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="reveal-init bg-leaf-soft border border-leaf-tint rounded-2xl p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                {typeof rev.rating === 'number' && (
                  <div className="flex items-center gap-1 mb-3 text-lemon">
                    {Array.from({ length: Math.min(5, Math.max(1, rev.rating)) }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-amber-400" aria-hidden="true" />
                    ))}
                  </div>
                )}
                <p className="text-sm text-body italic leading-relaxed mb-4">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-leaf-tint">
                <span className="text-xs font-bold text-ink block">
                  {rev.author}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
