import React, { useState } from 'react';
import { ShoppingBag, Trash2, CheckCircle, AlertCircle, Clock, Send, QrCode, Smartphone } from 'lucide-react';
import { cartConfig, MenuItem, resolveAssetUrl } from '../data/cart';
import { isPhoneNumberValid } from '../utils/helpers';

interface OrderSectionProps {
  cartQuantities: Record<string, number>;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onClearCart: () => void;
}

export const OrderSection: React.FC<OrderSectionProps> = ({
  cartQuantities,
  onUpdateQuantity,
  onClearCart,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupTime, setPickupTime] = useState('As soon as possible');
  const [note, setNote] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [qrLoadFailed, setQrLoadFailed] = useState(false);

  const isWhatsappActive = isPhoneNumberValid(cartConfig.whatsappNumber);
  const upiQrImage = cartConfig.upiQrImage?.trim();

  // Flatten menu items for lookup
  const allItemsMap = new Map<string, MenuItem>();
  cartConfig.menu.forEach((cat) => {
    cat.items.forEach((item) => {
      allItemsMap.set(item.id, item);
    });
  });

  // Calculate items in cart
  const cartEntries = Object.entries(cartQuantities)
    .filter(([_, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = allItemsMap.get(id) || {
        id,
        name: id === 'special' ? cartConfig.todaysSpecial.title : id,
        price: id === 'special' ? cartConfig.todaysSpecial.price : undefined,
        veg: true,
      };
      return { item, quantity: qty };
    });

  // Calculate total price only when EVERY selected item has a price
  const allHavePrice = cartEntries.length > 0 && cartEntries.every((e) => typeof e.item.price === 'number');
  const totalPrice = allHavePrice
    ? cartEntries.reduce((sum, e) => sum + (e.item.price || 0) * e.quantity, 0)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (cartEntries.length === 0) {
      setErrorMessage('Please add at least one item from the menu to place an order.');
      return;
    }

    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    const cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Build the WhatsApp message string strictly adhering to requested format:
    // "Hello Mr Chai Wale, I want to place a pickup order.", then the item lines "2 x Masala Chai",
    // then Name, Phone, Pickup time, Note, and the total if available.
    // Add a line: "Pickup only at the cart" (or delivery info if deliveryAvailable is true).
    const messageLines: string[] = [
      'Hello Mr Chai Wale, I want to place a pickup order.',
      '',
    ];

    cartEntries.forEach((entry) => {
      messageLines.push(`${entry.quantity} x ${entry.item.name}`);
    });

    if (totalPrice !== null) {
      messageLines.push('');
      messageLines.push(`Total: ₹${totalPrice}`);
    }

    messageLines.push('');
    messageLines.push(`Name: ${name.trim()}`);
    messageLines.push(`Phone: ${cleanedPhone}`);
    messageLines.push(`Pickup time: ${pickupTime}`);
    if (note.trim()) {
      messageLines.push(`Note: ${note.trim()}`);
    }

    messageLines.push('');
    if (cartConfig.deliveryAvailable) {
      messageLines.push('Delivery requested (as confirmed by cart)');
    } else {
      messageLines.push('Pickup only at the cart');
    }

    const fullMessage = messageLines.join('\n');
    const waUrl = isWhatsappActive
      ? `https://wa.me/${cartConfig.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(fullMessage)}`
      : `https://wa.me/?text=${encodeURIComponent(fullMessage)}`;

    // Open WhatsApp synchronously inside user submit event handler to avoid mobile popup blockers
    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = waUrl;
    }

    setStatusMessage('Opening WhatsApp to confirm your order...');
  };

  return (
    <section id="order" className="scroll-mt-16 py-14 bg-leaf-soft border-t border-leaf-tint">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-leaf-ink bg-white border border-leaf-tint px-3 py-1 rounded-full inline-block mb-2">
            Quick Pickup Tray
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Order for Quick Pickup
          </h2>
          <p className="mt-1 text-sm sm:text-base text-body">
            Skip the sidewalk queue. Send your order directly to our cart on WhatsApp.
          </p>
        </div>

        <div className="bg-white border border-leaf-tint rounded-3xl p-6 sm:p-8 shadow-xs">
          {/* Cart Items Summary */}
          <div className="mb-8">
            <div className="flex items-center justify-between pb-3 border-b border-leaf-tint">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-leaf-ink" aria-hidden="true" />
                <h3 className="font-bold text-ink text-base">
                  Selected Items ({cartEntries.length})
                </h3>
              </div>

              {cartEntries.length > 0 && (
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-xs font-semibold text-body hover:text-red-700 flex items-center gap-1 transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  Clear tray
                </button>
              )}
            </div>

            {cartEntries.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-body">Your pickup tray is empty right now.</p>
                <a
                  href="#menu"
                  className="mt-3 inline-flex items-center justify-center min-h-[44px] px-5 py-2 text-sm font-semibold text-leaf-ink bg-white border border-leaf-tint hover:bg-leaf-soft rounded-xl transition-colors"
                >
                  Browse Menu &amp; Add Items
                </a>
              </div>
            ) : (
              <div className="divide-y divide-leaf-soft mt-2">
                {cartEntries.map(({ item, quantity }) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-ink text-sm sm:text-base truncate">
                        {item.name}
                      </p>
                      {typeof item.price === 'number' && (
                        <p className="text-xs text-body">
                          ₹{item.price} each
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="inline-flex items-center bg-leaf-soft border border-leaf-tint rounded-xl p-0.5">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-leaf-ink hover:bg-white rounded-lg transition-colors cursor-pointer"
                          aria-label={`Decrease ${item.name}`}
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-ink select-none">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-leaf-ink hover:bg-white rounded-lg transition-colors cursor-pointer"
                          aria-label={`Increase ${item.name}`}
                        >
                          +
                        </button>
                      </div>

                      {typeof item.price === 'number' && (
                        <span className="text-sm font-bold text-ink w-14 text-right">
                          ₹{item.price * quantity}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Total price bar (only shown if all items have defined price) */}
                {totalPrice !== null && (
                  <div className="pt-4 flex items-center justify-between text-base font-extrabold text-ink">
                    <span>Estimated Total</span>
                    <span className="text-lg text-leaf-ink">₹{totalPrice}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pickup Form and QR Code Section Grid */}
          <div className="pt-6 border-t border-leaf-tint grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Pickup Form (7 columns on large screens) */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-leaf-ink">
                Pickup Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customer-name" className="block text-xs font-bold text-ink uppercase mb-1.5">
                    Your Name <span className="text-leaf-ink">*</span>
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-leaf-tint text-sm text-ink placeholder:text-body/60 focus-visible:ring-2 focus-visible:ring-leaf-ink bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="customer-phone" className="block text-xs font-bold text-ink uppercase mb-1.5">
                    Mobile Number (10 digits) <span className="text-leaf-ink">*</span>
                  </label>
                  <input
                    id="customer-phone"
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-leaf-tint text-sm text-ink placeholder:text-body/60 focus-visible:ring-2 focus-visible:ring-leaf-ink bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pickup-time" className="block text-xs font-bold text-ink uppercase mb-1.5">
                    Pickup Time <span className="text-leaf-ink">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="pickup-time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-leaf-tint text-sm text-ink focus-visible:ring-2 focus-visible:ring-leaf-ink bg-white appearance-none cursor-pointer pr-10"
                    >
                      <option value="As soon as possible">As soon as possible</option>
                      <option value="In 15 min">In 15 min</option>
                      <option value="In 30 min">In 30 min</option>
                      <option value="In 1 hour">In 1 hour</option>
                    </select>
                    <Clock className="w-4 h-4 text-leaf-ink absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                  </div>
                </div>

                <div>
                  <label htmlFor="order-note" className="block text-xs font-bold text-ink uppercase mb-1.5">
                    Special Note <span className="text-body font-normal">(optional)</span>
                  </label>
                  <input
                    id="order-note"
                    type="text"
                    placeholder="e.g. Less sugar, extra crispy maska bun"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-leaf-tint text-sm text-ink placeholder:text-body/60 focus-visible:ring-2 focus-visible:ring-leaf-ink bg-white"
                  />
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800" role="alert">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" aria-hidden="true" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Notice for placeholder number if WhatsApp is not yet configured */}
              {!isWhatsappActive && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-leaf-soft border border-leaf-tint text-xs text-leaf-ink">
                  <AlertCircle className="w-4 h-4 shrink-0 text-leaf-ink" aria-hidden="true" />
                  <span>
                    Owner notice: WhatsApp number is not yet configured. Update it in <code>src/data/cart.ts</code> for direct one-tap message dispatch to your cart phone.
                  </span>
                </div>
              )}

              {/* Status Message */}
              {statusMessage && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-leaf-tint text-xs sm:text-sm text-on-lemon font-medium" role="status">
                  <CheckCircle className="w-4 h-4 shrink-0 text-on-lemon" aria-hidden="true" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={cartEntries.length === 0}
                  className="w-full min-h-[48px] px-6 py-3 rounded-2xl text-base font-bold text-on-lemon bg-lemon hover:bg-lemon-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-leaf-ink cursor-pointer"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>Order on WhatsApp</span>
                </button>
              </div>

              <p className="text-center text-xs text-body pt-1">
                {cartConfig.deliveryAvailable
                  ? 'Delivery coordinated directly with cart.'
                  : 'Pickup only at the cart · No dining tables or waitstaff.'}
              </p>
            </form>

            {/* Quick Pickup QR Code Place (5 columns on large screens) */}
            <div className="lg:col-span-5 bg-leaf-soft border border-leaf-tint rounded-2xl p-5 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-lemon flex items-center justify-center text-on-lemon">
                  <QrCode className="w-4 h-4" aria-hidden="true" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-leaf-ink">
                  Quick Pickup &amp; Pay QR
                </h4>
              </div>

              {/* QR Image Slot with Fallback */}
              <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-2xl bg-white p-3 border border-leaf-tint shadow-xs flex items-center justify-center relative overflow-hidden">
                {upiQrImage && !qrLoadFailed ? (
                  <img
                    src={resolveAssetUrl(upiQrImage)}
                    alt={`Quick pickup QR code for ${cartConfig.name}`}
                    width={192}
                    height={192}
                    loading="lazy"
                    decoding="async"
                    onError={() => setQrLoadFailed(true)}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div
                    className="w-full h-full rounded-xl border-2 border-dashed border-leaf flex flex-col items-center justify-center p-3 text-center bg-white"
                    aria-label="Quick Pickup QR Code"
                  >
                    {/* Stylized QR representation */}
                    <div className="relative w-24 h-24 mb-2 flex items-center justify-center">
                      <svg
                        viewBox="0 0 100 100"
                        className="w-full h-full text-slate-800"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        {/* Top-left position marker */}
                        <rect x="5" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                        <rect x="13" y="13" width="12" height="12" rx="2" fill="currentColor" />

                        {/* Top-right position marker */}
                        <rect x="67" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                        <rect x="75" y="13" width="12" height="12" rx="2" fill="currentColor" />

                        {/* Bottom-left position marker */}
                        <rect x="5" y="67" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                        <rect x="13" y="75" width="12" height="12" rx="2" fill="currentColor" />

                        {/* QR Matrix dots simulation */}
                        <rect x="40" y="8" width="6" height="6" />
                        <rect x="52" y="8" width="6" height="6" />
                        <rect x="44" y="20" width="6" height="6" />
                        <rect x="8" y="44" width="6" height="6" />
                        <rect x="20" y="44" width="6" height="6" />
                        <rect x="44" y="44" width="12" height="12" rx="2" fill="#166534" />
                        <rect x="68" y="44" width="6" height="6" />
                        <rect x="84" y="44" width="6" height="6" />
                        <rect x="44" y="64" width="6" height="6" />
                        <rect x="56" y="64" width="6" height="6" />
                        <rect x="68" y="76" width="6" height="6" />
                        <rect x="84" y="76" width="6" height="6" />
                        <rect x="68" y="88" width="8" height="6" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-bold text-ink leading-tight">
                      Scan at Cart Counter
                    </span>
                    <span className="text-[10px] text-body mt-0.5">
                      GPay · PhonePe · Paytm · UPI
                    </span>
                  </div>
                )}
              </div>

              <span className="text-xs text-leaf-ink font-semibold mt-3 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
                Scan &amp; Pick Up Fast
              </span>
              <p className="mt-1 text-xs text-body leading-relaxed max-w-xs">
                Scan at the cart counter for seamless contactless payment when picking up your freshly prepared tray.
              </p>

              {cartConfig.upiId && (
                <div className="mt-3 px-3 py-1.5 rounded-xl bg-white border border-leaf-tint text-xs font-mono font-bold text-ink">
                  UPI: {cartConfig.upiId}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
