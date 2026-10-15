import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cartConfig } from '../data/cart';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleItem = (idx: number) => {
    setOpenIndex((current) => (current === idx ? null : idx));
  };

  return (
    <section id="faq" className="scroll-mt-16 py-14 bg-leaf-soft border-t border-leaf-tint">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-leaf-ink bg-white border border-leaf-tint px-3 py-1 rounded-full inline-block mb-2">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-1 text-sm sm:text-base text-body">
            Common questions about our street cart timings, orders, and payment.
          </p>
        </div>

        <div className="space-y-3.5">
          {cartConfig.faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="reveal-init bg-white border border-leaf-tint rounded-2xl overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                  className="w-full min-h-[52px] px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-ink hover:text-leaf-ink transition-colors focus-visible:ring-2 focus-visible:ring-leaf-ink cursor-pointer"
                >
                  <span className="flex items-center gap-2.5 text-sm sm:text-base">
                    <HelpCircle className="w-4 h-4 text-leaf-ink shrink-0" aria-hidden="true" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-leaf-ink shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-body leading-relaxed border-t border-leaf-soft">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
