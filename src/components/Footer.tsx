import React from 'react';
import { Coffee, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { cartConfig } from '../data/cart';
import { format12Hour } from '../utils/helpers';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const hasInstagram = Boolean(cartConfig.instagramUrl?.trim());

  return (
    <footer className="bg-white border-t border-leaf-tint pt-12 pb-24 sm:pb-12 text-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-leaf-tint">
          {/* Brand info */}
          <div className="md:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-lemon flex items-center justify-center text-on-lemon">
                <Coffee className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="font-bold text-lg text-ink">
                {cartConfig.name}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-body leading-relaxed max-w-sm mb-2">
              A local street food cart serving freshly brewed kulhad chai, warm snacks, and hot smiles every morning and evening.
            </p>
            <p className="text-xs text-leaf-ink font-semibold mb-3">
              {cartConfig.tagline}
            </p>
            {cartConfig.location.address && (
              <p className="text-xs text-body leading-relaxed max-w-sm flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-leaf-ink shrink-0 mt-0.5" aria-hidden="true" />
                <span>{cartConfig.location.address}</span>
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-leaf-ink mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#menu" className="text-body hover:text-leaf-ink transition-colors">
                  Menu &amp; Items
                </a>
              </li>
              <li>
                <a href="#order" className="text-body hover:text-leaf-ink transition-colors">
                  Quick WhatsApp Order
                </a>
              </li>
              <li>
                <a href="#find-us" className="text-body hover:text-leaf-ink transition-colors">
                  Cart Location &amp; Directions
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-body hover:text-leaf-ink transition-colors">
                  Photos
                </a>
              </li>
              <li>
                <a href="#faq" className="text-body hover:text-leaf-ink transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Timings & Social */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-leaf-ink mb-3">
                Daily Cart Timings
              </h4>
              <p className="text-xs sm:text-sm text-body">
                {cartConfig.hours.displayText || `${format12Hour(cartConfig.hours.open)} – ${format12Hour(cartConfig.hours.close)}`}
              </p>
              <p className="text-xs text-body mt-1">
                Open 7 days a week · Fresh batches all day
              </p>
            </div>

            <div className="mt-6 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-leaf-ink mb-2">
                Connect &amp; Contact
              </h4>
              {hasInstagram && (
                <div>
                  <a
                    href={cartConfig.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm text-body hover:text-leaf-ink transition-colors"
                    aria-label="Instagram page"
                  >
                    <Instagram className="w-4 h-4 text-leaf-ink" aria-hidden="true" />
                    <span>Follow us on Instagram</span>
                  </a>
                </div>
              )}
              {cartConfig.email && (
                <div>
                  <a
                    href={`mailto:${cartConfig.email}`}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm text-body hover:text-leaf-ink transition-colors"
                    aria-label="Email Mr Chai Wale"
                  >
                    <Mail className="w-4 h-4 text-leaf-ink" aria-hidden="true" />
                    <span>{cartConfig.email}</span>
                  </a>
                </div>
              )}
              {cartConfig.phone && (
                <div>
                  <a
                    href={cartConfig.telLink || `tel:+${cartConfig.phone.replace(/\D/g, '')}`}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm text-body hover:text-leaf-ink transition-colors"
                    aria-label="Call Mr Chai Wale"
                  >
                    <Phone className="w-4 h-4 text-leaf-ink" aria-hidden="true" />
                    <span>{cartConfig.displayPhone || cartConfig.phone}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-body">
          <p>© {currentYear} {cartConfig.name}. All rights reserved.</p>
          <p className="text-leaf-ink font-medium">Street Food Cart · Fresh &amp; Authentic</p>
        </div>
      </div>
    </footer>
  );
};
