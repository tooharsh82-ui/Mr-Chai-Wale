import React, { useState } from 'react';
import { Coffee, Menu as MenuIcon, X } from 'lucide-react';
import { cartConfig } from '../data/cart';
import { isPhoneNumberValid } from '../utils/helpers';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isWhatsappActive = isPhoneNumberValid(cartConfig.whatsappNumber);

  const navLinks = [
    { name: 'Menu', href: '#menu' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Order', href: '#order' },
    { name: 'Find Us', href: '#find-us' },
    { name: 'FAQ', href: '#faq' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const whatsappHref = isWhatsappActive
    ? `https://wa.me/${cartConfig.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hello Mr Chai Wale, I want to know more about the cart.')}`
    : '#order';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-leaf-tint shadow-xs transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand wordmark */}
        <a
          href="#"
          className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-leaf-ink rounded-lg p-1"
          aria-label={`${cartConfig.name} Home`}
        >
          <div className="w-9 h-9 rounded-full bg-lemon flex items-center justify-center text-on-lemon shadow-xs">
            <Coffee className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-ink tracking-tight leading-tight">
              {cartConfig.name}
            </span>
            <span className="text-[11px] font-medium text-leaf-ink leading-tight hidden xs:inline">
              Street Chai Cart
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-body hover:text-leaf-ink transition-colors py-2 px-1 focus-visible:ring-2 focus-visible:ring-leaf-ink rounded"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop WhatsApp CTA Button (hidden if placeholder) */}
        <div className="hidden md:flex items-center gap-3">
          {isWhatsappActive && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-sm font-semibold text-on-lemon bg-lemon hover:bg-lemon-dark rounded-xl transition-colors shadow-xs"
            >
              Order on WhatsApp
            </a>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl text-leaf-ink hover:bg-leaf-soft focus-visible:ring-2 focus-visible:ring-leaf-ink"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-leaf-tint px-4 pt-3 pb-6 shadow-md transition-all">
          <nav className="flex flex-col gap-2" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className="flex items-center min-h-[44px] px-3 py-2 text-base font-semibold text-ink hover:bg-leaf-soft hover:text-leaf-ink rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}

            {isWhatsappActive && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="mt-3 flex items-center justify-center min-h-[44px] px-4 py-2.5 text-base font-semibold text-on-lemon bg-lemon hover:bg-lemon-dark rounded-xl transition-colors shadow-xs"
              >
                Order on WhatsApp
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
