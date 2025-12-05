'use client';

/**
 * PRODUCT MODAL COMPONENT
 * Progressive disclosure funnel for product details
 */

import { useState, useEffect } from 'react';

export default function ProductModal({ product, domainConfig, onClose, onAffiliateClick }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Show details after a short delay for better UX
    const timer = setTimeout(() => setShowDetails(true), 300);
    return () => clearTimeout(timer);
  }, []);
  
  const handleAffiliateClick = async () => {
    setIsLoading(true);
    
    try {
      // Track the click
      onAffiliateClick(product);
      
      // Open affiliate link
      window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error opening affiliate link:', error);
      setIsLoading(false);
    }
  };
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '2rem',
        opacity: 1,
        transition: 'opacity 0.2s ease'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%)',
          borderRadius: '12px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          border: `1px solid ${domainConfig.theme.accent}`,
          boxShadow: `0 20px 60px rgba(0, 0, 0, 0.5)`,
          position: 'relative',
          transform: 'translateY(0)',
          transition: 'transform 0.3s ease'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: `${domainConfig.theme.accent}20`,
            border: 'none',
            color: domainConfig.theme.accent,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          ×
        </button>

        {/* Product Image */}
        <div style={{
          height: '300px',
          background: `url(${product.image}) center/cover`,
          borderRadius: '12px 12px 0 0',
          position: 'relative'
        }}>
          {/* Category Badge */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: domainConfig.theme.accent,
            color: '#0A0A0A',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: 600
          }}>
            {product.category}
          </div>
        </div>

        {/* Product Content */}
        <div style={{ padding: '2rem' }}>
          {/* Product Title */}
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: domainConfig.theme.accent,
            marginBottom: '1rem'
          }}>
            {product.name}
          </h2>

          {/* Product Description */}
          <p style={{
            color: '#fff',
            fontSize: '1.1rem',
            marginBottom: '1.5rem',
            lineHeight: 1.6
          }}>
            {product.description}
          </p>

          {/* Product Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '2rem',
            padding: '1rem',
            background: `${domainConfig.theme.accent}05`,
            borderRadius: '8px'
          }}>
            <div>
              <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                Skill Level
              </div>
              <div style={{ color: domainConfig.theme.accent, fontWeight: 600 }}>
                {product.skillLevel}
              </div>
            </div>
            <div>
              <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                Time Investment
              </div>
              <div style={{ color: domainConfig.theme.accent, fontWeight: 600 }}>
                {product.timeInvestment}
              </div>
            </div>
            <div>
              <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                Platform
              </div>
              <div style={{ color: domainConfig.theme.accent, fontWeight: 600 }}>
                {product.platform}
              </div>
            </div>
          </div>

          {/* Product Features */}
          {showDetails && (
            <div style={{
              opacity: 1,
              transition: 'opacity 0.3s ease',
              marginBottom: '2rem'
            }}>
              <h3 style={{
                color: domainConfig.theme.accent,
                fontSize: '1.2rem',
                marginBottom: '1rem'
              }}>
                  What&apos;s Included:
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {product.features.map((feature, idx) => (
                  <li key={idx} style={{
                    padding: '0.75rem 0',
                    borderBottom: `1px solid ${domainConfig.theme.accent}20`,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ color: domainConfig.theme.accent }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Price */}
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: domainConfig.theme.accent,
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            ${product.price}
            {product.recurring && (
              <span style={{
                fontSize: '1.2rem',
                fontWeight: 400,
                color: '#888'
              }}>
                /{product.recurringPeriod}
              </span>
            )}
          </div>

          {/* CTA Button */}
          <button
            onClick={handleAffiliateClick}
            disabled={isLoading}
            style={{
              width: '100%',
              background: isLoading ? 
                `${domainConfig.theme.accent}50` : 
                `linear-gradient(135deg, ${domainConfig.theme.accent} 0%, ${domainConfig.theme.accent}CC 100%)`,
              color: '#0A0A0A',
              padding: '1.25rem 2rem',
              borderRadius: '8px',
              textAlign: 'center',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              boxShadow: `0 0 20px ${domainConfig.theme.accent}30`,
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Opening...' : 'Get This Solution →'}
          </button>
          
          {/* Additional Info */}
          <div style={{
            marginTop: '1rem',
            textAlign: 'center',
            color: '#888',
            fontSize: '0.8rem'
          }}>
            {product.recurring ? 
              'Recurring subscription - Cancel anytime' : 
              'One-time purchase - Lifetime access'
            }
          </div>
        </div>
      </div>
    </div>
  );
}
