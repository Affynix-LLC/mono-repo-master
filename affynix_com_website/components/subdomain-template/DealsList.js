'use client';

import { useState } from 'react';
import DealDetailModal from '@/modals/DealDetailModal';

export default function DealsList({ products, config }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  

  const filteredProducts = products.filter(product => 
    filterCategory === 'All' || product.category === filterCategory
  );

  // Hover-to-open removed per product direction; click-only

  // W3Schools style modal opening
  const openModal = (product) => {
    setSelectedProduct(product);
  };

  return (
    <>
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Category Filter */}
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
            {['All', ...config.categories.filter(cat => cat !== 'All')].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className="px-6 py-2 rounded-lg font-medium transition-all whitespace-nowrap"
                style={{
                  backgroundColor: filterCategory === cat ? config.theme.accent : 'rgba(255,255,255,0.05)',
                  color: filterCategory === cat ? config.theme.primary : 'rgba(255,255,255,0.7)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => openModal(product)}
                className="bg-white/5 rounded-xl overflow-hidden border border-white/10 gold-glow-hover cursor-pointer group"
              >
                {/* Product Image */}
                <div 
                  className="h-48 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${product.image})` }}
                >
                  {product.recurring && (
                    <span className="absolute top-4 right-4 bg-gold text-black px-3 py-1 rounded-md text-sm font-semibold">
                      Subscription
                    </span>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-6">
                  <h3 
                    className="text-xl font-bold text-white mb-2 transition-colors"
                    style={{
                      color: 'white'
                    }}
                    onMouseEnter={(e) => e.target.style.color = config.theme.accent}
                    onMouseLeave={(e) => e.target.style.color = 'white'}
                  >
                    {product.name}
                  </h3>
                  
                  <p className="text-white/60 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Quick Specs */}
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span 
                      className="px-3 py-1 rounded-md text-xs"
                      style={{
                        backgroundColor: `${config.theme.accent}20`,
                        color: config.theme.accent
                      }}
                    >
                      {product.skillLevel}
                    </span>
                    <span 
                      className="px-3 py-1 rounded-md text-xs"
                      style={{
                        backgroundColor: `${config.theme.accent}20`,
                        color: config.theme.accent
                      }}
                    >
                      {product.timeInvestment}
                    </span>
                  </div>

                  {/* Price */}
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: config.theme.accent }}
                  >
                    ${product.price}
                    {product.recurring && (
                      <span className="text-sm text-white/60 font-normal">
                        /{product.recurringPeriod}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DealDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        domainConfig={config}
      />
      
      {/* Hover modal removed */}
    </>
  );
}
