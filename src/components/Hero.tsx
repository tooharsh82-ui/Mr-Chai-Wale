import React from 'react';
import { MapPin, Navigation, MessageCircle } from 'lucide-react';
import { cartConfig } from '../data/cart';
import { getCartStatus, isPhoneNumberValid } from '../utils/helpers';
import { ChaiCupIllustration } from './ChaiCupIllustration';

export const Hero: React.FC = () => {
  const status = getCartStatus(cartConfig.hours);
  const isWhatsappActive = isPhoneNumberValid(cartConfig.whatsappNumber);
  const hasMapsUrl = Boolean(cartConfig.location.mapsUrl?.trim());

  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-14 sm:pt-12 sm:pb-20">
      {/* Decorative light green background blobs */}
      <div
        className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-leaf-soft opacity-60 pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-4 left-1/4 -ml-40 w-80 h-80 rounded-full bg-leaf-soft opacity-40 pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Live Open / Closed Status Pill */}
            <div className="reveal-init mb-4 inline-flex items-center">
              {status.isOpen ? (
                <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-leaf text-on-lemon shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-on-lemon mr-2 inline-block shrink-0 animate-none" />
                  {status.pillText}
                </span>
              ) : (
                <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-slate-100 text-slate-600 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-slate-400 mr-2 inline-block shrink-0" />
                  {status.pillText}
                </span>
              )}
            </div>

            {/* Hinglish Tagline Badge */}
            <div className="reveal-init inline-block mb-3">
              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-leaf-ink bg-leaf-tint rounded-lg">
                {cartConfig.tagline}
              </span>
            </div>

            {/* Headline */}
            <h1 className="reveal-init text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink tracking-tight leading-tight">
              Street-Brewed Kulhad Chai &amp; Fresh Hot Snacks
            </h1>

            {/* Subheading */}
            <p className="reveal-init mt-4 text-base sm:text-lg text-body leading-relaxed max-w-xl">
              Freshly pounded ginger and cardamom boiled with full-cream milk in earthy clay cups.
              Walk up, grab your hot cup in 2 minutes, or order ahead on WhatsApp for zero waiting.
            </p>

            {/* Location highlight teaser */}
            <div className="reveal-init mt-4 flex items-center gap-2 text-xs sm:text-sm text-leaf-ink font-medium">
              <MapPin className="w-4 h-4 text-leaf-ink shrink-0" aria-hidden="true" />
              <span>
                {cartConfig.location.landmark}, {cartConfig.location.area}
              </span>
            </div>

            {/* CTA Action Buttons */}
            <div className="reveal-init mt-8 flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
              {isWhatsappActive && (
                <a
                  href={`https://wa.me/${cartConfig.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hello Mr Chai Wale, I want to place an order.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 text-base font-semibold text-on-lemon bg-lemon hover:bg-lemon-dark rounded-2xl transition-colors shadow-xs w-full sm:w-auto focus-visible:ring-2 focus-visible:ring-leaf-ink"
                >
                  <MessageCircle className="w-5 h-5 mr-2 shrink-0" aria-hidden="true" />
                  Order on WhatsApp
                </a>
              )}

              {/* Quick Jump to Menu button */}
              <a
                href="#menu"
                className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 text-base font-semibold text-leaf-ink bg-white border border-leaf-tint hover:bg-leaf-soft rounded-2xl transition-colors shadow-xs w-full sm:w-auto focus-visible:ring-2 focus-visible:ring-leaf-ink"
              >
                View Menu &amp; Order
              </a>

              {hasMapsUrl && (
                <a
                  href={cartConfig.location.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 text-base font-semibold text-leaf-ink bg-white border border-leaf-tint hover:bg-leaf-soft rounded-2xl transition-colors shadow-xs w-full sm:w-auto focus-visible:ring-2 focus-visible:ring-leaf-ink"
                >
                  <Navigation className="w-5 h-5 mr-2 shrink-0" aria-hidden="true" />
                  Get Directions
                </a>
              )}
            </div>
          </div>

          {/* Inline SVG Illustration Container */}
          <div className="lg:col-span-5 flex items-center justify-center reveal-init">
            <ChaiCupIllustration className="w-72 h-72 sm:w-84 sm:h-84 lg:w-96 lg:h-96" />
          </div>
        </div>
      </div>
    </section>
  );
};
