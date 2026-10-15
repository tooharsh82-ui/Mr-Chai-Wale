import React from 'react';
import { Users, CheckCircle2, MessageCircle } from 'lucide-react';
import { cartConfig } from '../data/cart';
import { isPhoneNumberValid } from '../utils/helpers';

export const BulkOrdersSection: React.FC = () => {
  const isWhatsappActive = isPhoneNumberValid(cartConfig.whatsappNumber);
  const bulk = cartConfig.bulkOrder;

  const waHref = isWhatsappActive
    ? `https://wa.me/${cartConfig.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hello Mr Chai Wale, I want a bulk order quote.')}`
    : '#order';

  return (
    <section id="bulk-orders" className="scroll-mt-16 py-14 bg-white border-t border-leaf-tint">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="reveal-init bg-leaf-soft border-2 border-leaf rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf text-on-lemon text-xs font-bold mb-3">
                <Users className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Office, Events &amp; Gathering Cart Service</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                {bulk.title}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-body leading-relaxed max-w-2xl">
                {bulk.description}
              </p>

              <div className="mt-5 space-y-2.5">
                {bulk.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink font-medium">
                    <CheckCircle2 className="w-4 h-4 text-leaf-ink shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
              {isWhatsappActive && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-6 py-3 text-sm sm:text-base font-bold text-on-lemon bg-lemon hover:bg-lemon-dark rounded-2xl transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-leaf-ink"
                >
                  <MessageCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                  Ask on WhatsApp
                </a>
              )}
              <span className="text-xs text-body mt-2.5">
                Pre-order 30-45 mins in advance for large batches.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
