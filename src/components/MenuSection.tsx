import React, { useState } from 'react';
import { Plus, Minus, ShoppingBag } from 'lucide-react';
import { cartConfig, MenuItem } from '../data/cart';
import { VegMark } from './VegMark';
import { OptimizedImage } from './OptimizedImage';

interface MenuSectionProps {
  cartQuantities: Record<string, number>;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  cartQuantities,
  onUpdateQuantity,
}) => {
  // Category chips come directly from menu data (No 'All' tab to avoid overwhelming long lists)
  const categoryChips = cartConfig.menu;

  const defaultCategoryId =
    cartConfig.menu.find((cat) => cat.id === 'chai')?.id || cartConfig.menu[0]?.id || 'chai';

  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategoryId);

  // Compute filtered items on render for the active category
  const activeCategory =
    cartConfig.menu.find((cat) => cat.id === selectedCategory) || cartConfig.menu[0];

  const displayItems: Array<{ item: MenuItem; categoryName: string }> = activeCategory
    ? activeCategory.items.map((item) => ({ item, categoryName: activeCategory.name }))
    : [];

  const activeSectionTitle = `${activeCategory?.name || 'Chai'} Menu`;

  const totalCartCount = Object.values(cartQuantities).reduce((acc, qty) => acc + qty, 0);

  return (
    <section id="menu" className="reveal-init scroll-mt-16 py-14 bg-white border-t border-leaf-tint">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-leaf-ink bg-leaf-soft border border-leaf-tint px-3 py-1 rounded-full inline-block mb-2">
              Cart Menu · Freshly Prepared
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              What We Boil &amp; Fry
            </h2>
            <p className="mt-1 text-sm sm:text-base text-body">
              Everything prepared hot on order. Tap Add to assemble your quick pickup tray.
            </p>
          </div>

          {/* Quick Cart Summary pill if items are added */}
          {totalCartCount > 0 && (
            <a
              href="#order"
              className="inline-flex items-center gap-2 self-start md:self-auto px-4 py-2 rounded-2xl bg-leaf text-on-lemon text-sm font-bold shadow-xs hover:bg-leaf-tint transition-colors focus-visible:ring-2 focus-visible:ring-leaf-ink"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              <span>{totalCartCount} item{totalCartCount > 1 ? 's' : ''} in tray · Review</span>
            </a>
          )}
        </div>

        {/* Category Filter Chips - Chai, Coffee, Momos, Sandwich, Maggi, Bun, etc. */}
        <div
          className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-6 no-scrollbar flex-nowrap"
          role="tablist"
          aria-label="Menu categories"
        >
          {categoryChips.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(cat.id)}
                className={`min-h-[44px] px-5 py-2 rounded-full text-sm font-semibold transition-colors shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-leaf-ink ${
                  isSelected
                    ? 'bg-lemon text-on-lemon shadow-xs font-bold'
                    : 'bg-white text-leaf-ink border border-leaf-tint hover:bg-leaf-soft'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Active category label & item counter */}
        <div className="flex items-center justify-between mb-5 pb-2 border-b border-leaf-tint">
          <h3 className="text-base sm:text-lg font-bold text-ink flex items-center gap-2">
            <span>{activeSectionTitle}</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-leaf-soft text-leaf-ink border border-leaf-tint">
              {displayItems.length} items
            </span>
          </h3>
        </div>

        {/* Menu Cards Grid */}
        {displayItems.length === 0 ? (
          <div className="py-14 text-center text-body text-sm font-medium bg-leaf-soft/40 rounded-2xl border border-dashed border-leaf-tint">
            No items in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayItems.map(({ item, categoryName }) => {
              const quantity = cartQuantities[item.id] || 0;

              return (
                <div
                  key={item.id}
                  className="bg-white border border-leaf-tint hover:border-leaf rounded-2xl p-5 shadow-xs transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <VegMark veg={item.veg} />
                        <span className="text-xs font-semibold text-leaf-ink uppercase tracking-wide">
                          {categoryName}
                        </span>
                      </div>

                      {typeof item.price === 'number' && (
                        <span className="text-base font-extrabold text-ink">
                          ₹{item.price}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-ink mb-1.5">
                      {item.name}
                    </h3>

                    {item.image && (
                      <div className="mb-3 rounded-xl overflow-hidden border border-leaf-tint">
                        <OptimizedImage
                          src={item.image}
                          alt={item.name}
                          width={600}
                          height={400}
                          aspectRatioClass="aspect-[16/9]"
                          priority={false}
                        />
                      </div>
                    )}

                    {item.description && (
                      <p className="text-xs sm:text-sm text-body leading-relaxed mb-4">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Bottom Action Area: Add button or Quantity Stepper */}
                  <div className="pt-3 border-t border-leaf-soft flex items-center justify-between">
                    <span className="text-xs text-body">
                      {typeof item.price === 'number' ? 'Fresh on cart' : 'Seasonal price'}
                    </span>

                    {quantity === 0 ? (
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="inline-flex items-center justify-center min-h-[44px] min-w-[88px] px-4 py-2 rounded-xl text-sm font-bold text-on-lemon bg-lemon hover:bg-lemon-dark transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-leaf-ink cursor-pointer"
                        aria-label={`Add ${item.name} to order`}
                      >
                        <Plus className="w-4 h-4 mr-1" aria-hidden="true" />
                        Add
                      </button>
                    ) : (
                      <div className="inline-flex items-center bg-leaf-soft border border-leaf-tint rounded-xl p-0.5">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                          className="w-11 h-11 flex items-center justify-center text-leaf-ink hover:bg-white rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-leaf-ink cursor-pointer"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <span className="w-8 text-center text-sm font-extrabold text-ink select-none">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                          className="w-11 h-11 flex items-center justify-center text-leaf-ink hover:bg-white rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-leaf-ink cursor-pointer"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
