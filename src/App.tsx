import React, { useState } from 'react';
import { useReveal } from './hooks/useReveal';
import { NoticeBanner } from './components/NoticeBanner';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuickInfoStrip } from './components/QuickInfoStrip';
import { TodaysSpecial } from './components/TodaysSpecial';
import { MenuSection } from './components/MenuSection';
import { OrderSection } from './components/OrderSection';
import { UpiSection } from './components/UpiSection';
import { BulkOrdersSection } from './components/BulkOrdersSection';
import { GallerySection } from './components/GallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { FindUsSection } from './components/FindUsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { MobileBottomBar } from './components/MobileBottomBar';

export default function App() {
  // Shared IntersectionObserver for fade-up reveals
  useReveal();

  // Cart quantities state: mapping item ID to selected count
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({});

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    setCartQuantities((prev) => {
      const updated = { ...prev };
      if (quantity <= 0) {
        delete updated[itemId];
      } else {
        updated[itemId] = quantity;
      }
      return updated;
    });
  };

  const handleClearCart = () => {
    setCartQuantities({});
  };

  const handleAddSpecial = () => {
    // Smooth scroll to menu section where Rose Tea Cutting, Glass, and Kulhad are available
    const menuEl = document.getElementById('menu');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-ink flex flex-col font-sans selection:bg-leaf-tint selection:text-leaf-ink">
      {/* 1. Optional Notice Banner */}
      <NoticeBanner />

      {/* 2. Sticky Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* 3. Hero Section */}
        <Hero />

        {/* 4. Quick-Info Strip */}
        <QuickInfoStrip />

        {/* 5. Today's Special (Hidden when empty) */}
        <TodaysSpecial onAddSpecial={handleAddSpecial} />

        {/* 6. Menu Section */}
        <MenuSection
          cartQuantities={cartQuantities}
          onUpdateQuantity={handleUpdateQuantity}
        />

        {/* 7. Gallery (Cart Moments) */}
        <GallerySection />

        {/* 8. Order Section (Quick Pickup) */}
        <OrderSection
          cartQuantities={cartQuantities}
          onUpdateQuantity={handleUpdateQuantity}
          onClearCart={handleClearCart}
        />

        {/* 9. Bulk and Party Orders */}
        <BulkOrdersSection />

        {/* 10. Pay by UPI (Hidden when upiId is empty) */}
        <UpiSection />

        {/* 11. Reviews (Auto-hidden when empty) */}
        <ReviewsSection />

        {/* 12. Find Us */}
        <FindUsSection />

        {/* 13. FAQ Accordion (last) */}
        <FaqSection />
      </main>

      {/* 15. Footer */}
      <Footer />

      {/* 16. Mobile Sticky Bottom Bar (Hidden if phone & whatsapp numbers contain 'X') */}
      <MobileBottomBar />

      {/* 
        OPTIONAL FUTURE CHATBOT ARCHITECTURE:
        If an interactive assistant or ordering bot is added later, load it dynamically on demand:
        const LazyChatbot = React.lazy(() => import('./components/Chatbot'));
        Render only when activated by user gesture to preserve 0KB initial payload & <2s FMP.
      */}
    </div>
  );
}
