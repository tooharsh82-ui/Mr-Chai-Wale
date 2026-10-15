import React, { useState } from 'react';
import { QrCode, Copy, Check, Smartphone } from 'lucide-react';
import { cartConfig, resolveAssetUrl } from '../data/cart';

export const UpiSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [qrLoadFailed, setQrLoadFailed] = useState(false);
  const upiId = cartConfig.upiId?.trim();
  const upiQrImage = cartConfig.upiQrImage?.trim();

  // Hide the entire section if upiId is empty
  if (!upiId) {
    return null;
  }

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(upiId);
        setCopied(true);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = upiId;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
      }
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="upi" className="scroll-mt-16 py-14 bg-white border-t border-leaf-tint">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-leaf-ink bg-leaf-soft border border-leaf-tint px-3 py-1 rounded-full inline-block mb-2">
            Zero Cash Hassle
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Pay by UPI at the Cart Counter
          </h2>
          <p className="mt-1 text-sm sm:text-base text-body">
            GPay, PhonePe, Paytm, BHIM, or any banking app accepted.
          </p>
        </div>

        <div className="bg-leaf-soft border border-leaf-tint rounded-3xl p-6 sm:p-8 shadow-xs max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 justify-between">
            {/* QR Image Slot or Placeholder Tile */}
            <div className="shrink-0 flex flex-col items-center">
              {upiQrImage && !qrLoadFailed ? (
                <div className="w-44 h-44 rounded-2xl bg-white p-2 border border-leaf-tint shadow-xs overflow-hidden flex items-center justify-center">
                  <img
                    src={resolveAssetUrl(upiQrImage)}
                    alt={`UPI QR code for ${cartConfig.name}`}
                    width={176}
                    height={176}
                    loading="lazy"
                    decoding="async"
                    onError={() => setQrLoadFailed(true)}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div 
                  className="w-44 h-44 rounded-2xl bg-white border-2 border-dashed border-leaf flex flex-col items-center justify-center p-4 text-center shadow-xs"
                  aria-label="UPI QR Code placeholder"
                >
                  <div className="w-12 h-12 rounded-full bg-leaf-tint flex items-center justify-center text-leaf-ink mb-2">
                    <QrCode className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-bold text-ink">Scan at Cart Counter</span>
                  <span className="text-[11px] text-body mt-0.5">Printed QR stand on table</span>
                </div>
              )}
              <span className="text-xs text-leaf-ink font-semibold mt-2.5 flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
                All UPI Apps Supported
              </span>
            </div>

            {/* UPI ID Details and Copy Box */}
            <div className="flex-1 w-full flex flex-col justify-center text-center sm:text-left">
              <span className="text-xs uppercase font-bold text-leaf-ink tracking-wider">
                Cart UPI ID
              </span>
              <div className="mt-2 p-3 bg-white border border-leaf-tint rounded-2xl flex items-center justify-between gap-3 shadow-xs">
                <code className="text-sm sm:text-base font-bold text-ink font-mono truncate select-all">
                  {upiId}
                </code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-bold text-on-lemon bg-lemon hover:bg-lemon-dark transition-colors flex items-center gap-1.5 shrink-0 focus-visible:ring-2 focus-visible:ring-leaf-ink cursor-pointer"
                  aria-label="Copy UPI ID to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <p className="mt-3 text-xs text-body leading-relaxed">
                Show the payment success screen to the cart brother after transferring. Exact change not needed!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
