'use client';

import { useEffect } from 'react';

export default function DealDetailModal({ product, isOpen, onClose, isHoverModal = false }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isHoverModal ? 'bg-black/50' : 'bg-black/90'} backdrop-blur-sm`}
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-auto shadow-2xl ${isHoverModal ? 'border-2 border-gray-300' : 'border border-gray-200'}`}
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        {/* Nutrition Label Header */}
        <div className="bg-black text-white p-3 text-center">
          <div className="text-lg font-bold">SOLUTION FACTS</div>
          <div className="text-xs">Serving Size: 1 Complete Program</div>
        </div>

        {/* Product Image */}
        <div 
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${product.image})` }}
        />

        {/* Nutrition Label Content */}
        <div className="p-4 bg-white text-black">
          {/* Product Name */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-black mb-1">
              {product.name}
            </h2>
            <div className="text-sm text-gray-600">
              {product.category} • {product.platform}
            </div>
          </div>

          {/* Nutrition Facts Table */}
          <div className="border-2 border-black mb-4">
            <div className="bg-black text-white p-2 text-center font-bold text-sm">
              SOLUTION FACTS
            </div>
            
            <div className="p-3 space-y-2 text-sm">
              <div className="flex justify-between border-b border-gray-300 pb-1">
                <span className="font-bold">Skill Level</span>
                <span className="font-bold">{product.skillLevel}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-1">
                <span className="font-bold">Time Investment</span>
                <span className="font-bold">{product.timeInvestment}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-1">
                <span className="font-bold">Platform</span>
                <span className="font-bold">{product.platform}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-1">
                <span className="font-bold">Format</span>
                <span className="font-bold">{product.format || 'Digital'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-1">
                <span className="font-bold">Support</span>
                <span className="font-bold">{product.support || 'Community'}</span>
              </div>
            </div>
          </div>

          {/* Ingredients (Features) */}
          <div className="mb-4">
            <div className="bg-black text-white p-2 text-center font-bold text-sm mb-2">
              INGREDIENTS
            </div>
            <div className="text-xs space-y-1">
              {product.features.slice(0, 5).map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-gray-600">•</span>
                  <span>{feature}</span>
                </div>
              ))}
              {product.features.length > 5 && (
                <div className="text-gray-500 italic">
                  ...and {product.features.length - 5} more components
                </div>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="text-center mb-4 p-3 bg-gray-100 rounded">
            <div className="text-2xl font-bold text-black">
              ${product.price}
              {product.recurring && (
                <span className="text-sm text-gray-600 font-normal">
                  /{product.recurringPeriod}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              One-time purchase • Instant access
            </div>
          </div>

          {/* CTA Button */}
          <a
            href={product.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-black text-white text-center font-bold py-3 rounded hover:bg-gray-800 transition-colors"
          >
            GET THIS SOLUTION →
          </a>

          {/* Disclaimer */}
          <div className="text-xs text-gray-500 text-center mt-3 leading-tight">
            Results may vary. Individual success depends on effort and application.
          </div>
        </div>

        {/* Close Button for non-hover modals */}
        {!isHoverModal && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

