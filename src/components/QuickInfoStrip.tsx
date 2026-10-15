import React from 'react';
import { MapPin, Clock, QrCode, Users } from 'lucide-react';
import { cartConfig } from '../data/cart';
import { format12Hour } from '../utils/helpers';

export const QuickInfoStrip: React.FC = () => {
  const cards = [
    {
      icon: MapPin,
      title: 'Cart Location',
      detail: `${cartConfig.location.landmark}`,
      sub: cartConfig.location.area,
      href: '#find-us',
    },
    {
      icon: Clock,
      title: 'Daily Timings',
      detail: cartConfig.hours.displayText || `${format12Hour(cartConfig.hours.open)} – ${format12Hour(cartConfig.hours.close)}`,
      sub: 'Open all 7 days a week',
      href: '#find-us',
    },
    {
      icon: QrCode,
      title: 'Instant UPI',
      detail: cartConfig.upiId ? 'GPay, PhonePe, Paytm' : 'Cash & Digital Pay',
      sub: 'Scan QR at cart counter',
      href: cartConfig.upiId ? '#upi' : '#menu',
    },
    {
      icon: Users,
      title: 'Bulk & Office',
      detail: '10 to 50+ Hot Cups',
      sub: 'Kettle packing for teams',
      href: '#bulk-orders',
    },
  ];

  return (
    <section className="bg-leaf-soft py-10 border-y border-leaf-tint">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className="reveal-init group bg-white border border-leaf-tint rounded-2xl p-5 shadow-xs hover:border-leaf transition-colors flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-leaf-ink"
              >
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-leaf flex items-center justify-center text-on-lemon shrink-0">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-leaf-ink">
                      {item.title}
                    </h2>
                    <p className="text-base font-bold text-ink leading-snug">
                      {item.detail}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-body border-t border-leaf-tint pt-2.5">
                  {item.sub}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
