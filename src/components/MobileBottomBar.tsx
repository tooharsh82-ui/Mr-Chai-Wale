import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { cartConfig } from '../data/cart';
import { isPhoneNumberValid } from '../utils/helpers';

/**
 * Mobile only: a sticky bottom bar with "Call" and "Order on WhatsApp".
 * Adheres strictly to:
 * - If value contains 'X', hide the Call and WhatsApp buttons instead of showing broken links.
 * - Primary button = lemon background with on-lemon text.
 * - Secondary button = white background, leaf-ink text, leaf-tint border.
 * - Min 44px tap targets.
 */
export const MobileBottomBar: React.FC = () => {
  const isPhoneActive = isPhoneNumberValid(cartConfig.phone);
  const isWhatsappActive = isPhoneNumberValid(cartConfig.whatsappNumber);

  // If neither phone nor WhatsApp is configured with real digits, hide the bottom bar
  if (!isPhoneActive && !isWhatsappActive) {
    return null;
  }

  const phoneHref = isPhoneActive ? `tel:+${cartConfig.phone.replace(/\D/g, '')}` : '#';
  const whatsappHref = isWhatsappActive
    ? `https://wa.me/${cartConfig.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hello Mr Chai Wale, I want to place an order.')}`
    : '#order';

  return (
    <aside 
      aria-label="Quick mobile contact actions"
      className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white border-t border-leaf-tint px-3 py-2.5 shadow-lg"
    >
      <div className="flex items-center gap-2.5">
        {isPhoneActive && (
          <a
            href={phoneHref}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-bold text-leaf-ink bg-white border border-leaf-tint hover:bg-leaf-soft transition-colors flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-leaf-ink ${
              isWhatsappActive ? 'w-2/5' : 'w-full'
            }`}
          >
            <Phone className="w-4 h-4 text-leaf-ink shrink-0" aria-hidden="true" />
            <span>Call</span>
          </a>
        )}

        {isWhatsappActive && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-bold text-on-lemon bg-lemon hover:bg-lemon-dark transition-colors flex items-center justify-center gap-2 shadow-xs focus-visible:ring-2 focus-visible:ring-leaf-ink ${
              isPhoneActive ? 'w-3/5' : 'w-full'
            }`}
          >
            <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Order on WhatsApp</span>
          </a>
        )}
      </div>
    </aside>
  );
};
