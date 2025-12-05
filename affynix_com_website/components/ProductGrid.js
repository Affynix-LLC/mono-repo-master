'use client';

/**
 * PRODUCT GRID COMPONENT
 * Modal-trigger grid system with progressive disclosure
 */

import { useState, useEffect } from 'react';
import ProductModal from './ProductModal.js';
import { trackProductInteraction } from '../lib/analytics.js';

export default function ProductGrid({ 
  products, 
  domainConfig, 
  searchTerm, 
  filterCategory, 
  onFilterChange 
}) {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Filter products based on search and category
  const filteredProducts = (products || []).filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  
  const handleProductHover = (product) => {
    setHoveredProduct(product);
    trackProductInteraction('hover', product, domainConfig);
  };
  
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    trackProductInteraction('click', product, domainConfig);
    
    // Track modal open
    if (window.affynixAnalytics) {
      window.affynixAnalytics.trackModalOpen('product_modal', product.id);
    }
  };
  
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setHoveredProduct(null);
  };
  
  const handleAffiliateClick = (product) => {
    trackProductInteraction('affiliate_click', product, domainConfig);
    
    // Track in analytics
    if (window.affynixAnalytics) {
      window.affynixAnalytics.trackAffiliateClick(
        product.id, 
        product.name, 
        product.price
      );
    }
  };
  
  return (
    <>
      {/* Filter Bar */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem 2rem',
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {domainConfig.categories.map(category => (
          <button
            key={category}
            onClick={() => onFilterChange(category)}
            style={{
              background: filterCategory === category ? domainConfig.theme.accent : 'transparent',
              color: filterCategory === category ? '#0A0A0A' : domainConfig.theme.accent,
              border: `1px solid ${domainConfig.theme.accent}`,
              padding: '0.5rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'all 0.3s ease'
            }}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Product Grid */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '2rem'
      }}>
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onMouseEnter={() => handleProductHover(product)}
            onMouseLeave={() => setHoveredProduct(null)}
            onClick={() => handleProductClick(product)}
            style={{
              background: 'rgba(26, 26, 26, 0.8)',
              borderRadius: '8px',
              overflow: 'hidden',
              border: `1px solid ${domainConfig.theme.accent}30`,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              transform: hoveredProduct?.id === product.id ? 'translateY(-4px)' : 'none',
              boxShadow: hoveredProduct?.id === product.id ? 
                `0 8px 30px ${domainConfig.theme.accent}30` : 'none'
            }}
          >
            {/* Product Image */}
            <div style={{
              height: '200px',
              background: `url(${product.image}) center/cover`,
              position: 'relative'
            }}>
              {product.recurring && (
                <span style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: domainConfig.theme.accent,
                  color: '#0A0A0A',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  Subscription
                </span>
              )}
            </div>
            
            {/* Product Content */}
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                marginBottom: '0.5rem',
                color: '#fff'
              }}>
                {product.name}
              </h3>
              
              <p style={{
                color: '#888',
                fontSize: '0.9rem',
                marginBottom: '1rem',
                lineHeight: 1.5
              }}>
                {product.description}
              </p>
              
              {/* Product Tags */}
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1rem',
                flexWrap: 'wrap'
              }}>
                <span style={{
                  background: `${domainConfig.theme.accent}20`,
                  color: domainConfig.theme.accent,
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  {product.skillLevel}
                </span>
                <span style={{
                  background: `${domainConfig.theme.accent}20`,
                  color: domainConfig.theme.accent,
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  {product.timeInvestment}
                </span>
              </div>
              
              {/* Price */}
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: domainConfig.theme.accent
              }}>
                ${product.price}
                {product.recurring && (
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: 400,
                    color: '#888'
                  }}>
                    /{product.recurringPeriod}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </main>
      
      {/* Product Modal */}
      {showModal && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          domainConfig={domainConfig}
          onClose={handleModalClose}
          onAffiliateClick={handleAffiliateClick}
        />
      )}
    </>
  );
}
