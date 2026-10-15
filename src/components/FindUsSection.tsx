import React from 'react';
import { MapPin, Navigation, Clock, Info } from 'lucide-react';
import { cartConfig } from '../data/cart';
import { format12Hour } from '../utils/helpers';

export const FindUsSection: React.FC = () => {
  const loc = cartConfig.location;
  const hasMapsUrl = Boolean(loc.mapsUrl?.trim());

  return (
    <section id="find-us" className="scroll-mt-16 py-14 bg-white border-t border-leaf-tint">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-leaf-ink bg-leaf-soft border border-leaf-tint px-3 py-1 rounded-full inline-block mb-2">
            Cart Spot
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Where to Find Our Cart
          </h2>
          <p className="mt-1 text-sm sm:text-base text-body">
            Look for our steaming brass kettle and the green cart banner.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Address & Timings Information Card */}
          <div className={`${hasMapsUrl ? 'lg:col-span-5' : 'lg:col-span-8 lg:col-start-3'} bg-leaf-soft border border-leaf-tint rounded-3xl p-6 sm:p-8 shadow-xs`}>
            {/* Location block */}
            <div className="flex items-start gap-3.5 mb-6">
              <div className="w-11 h-11 rounded-xl bg-leaf flex items-center justify-center text-on-lemon shrink-0">
                <MapPin className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-leaf-ink">
                  Street Address
                </span>
                <h3 className="text-lg font-bold text-ink mt-0.5">
                  {loc.landmark}
                </h3>
                <p className="text-sm text-body">
                  {loc.address || `${loc.area}, ${loc.city}`}
                </p>
              </div>
            </div>

            {/* Timings block */}
            <div className="flex items-start gap-3.5 mb-6 pt-5 border-t border-leaf-tint">
              <div className="w-11 h-11 rounded-xl bg-leaf flex items-center justify-center text-on-lemon shrink-0">
                <Clock className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-leaf-ink">
                  Daily Hours
                </span>
                <p className="text-base font-bold text-ink mt-0.5">
                  {cartConfig.hours.displayText || `${format12Hour(cartConfig.hours.open)} – ${format12Hour(cartConfig.hours.close)}`}
                </p>
                <p className="text-xs text-body">
                  Open every day (Monday to Sunday)
                </p>
              </div>
            </div>

            {/* Find Tip box */}
            {loc.findTip && (
              <div className="p-4 rounded-2xl bg-white border border-leaf-tint flex items-start gap-3 mb-6">
                <Info className="w-4 h-4 text-leaf-ink shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs sm:text-sm text-body leading-relaxed">
                  <strong className="text-ink">Tip: </strong>
                  {loc.findTip}
                </p>
              </div>
            )}

            {/* Get Directions Button (shown only when mapsUrl is non-empty) */}
            {hasMapsUrl && (
              <a
                href={loc.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-xl text-sm font-bold text-leaf-ink bg-white border border-leaf-tint hover:bg-leaf-soft transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-leaf-ink"
              >
                <Navigation className="w-4 h-4 mr-2" aria-hidden="true" />
                Get Directions on Google Maps
              </a>
            )}
          </div>

          {/* Lazy-loaded Google Maps iframe (only when mapsUrl is configured) */}
          {hasMapsUrl && (
            <div className="lg:col-span-7 h-80 sm:h-96 rounded-3xl overflow-hidden border border-leaf-tint shadow-xs bg-leaf-soft">
              <iframe
                title={`Map location of ${cartConfig.name}`}
                src={loc.mapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
