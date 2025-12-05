'use client';

import { useState, useEffect, useCallback } from 'react';
import DomainHeader from './DomainHeader';
import ProductGrid from './ProductGrid';
import Footer from './Footer';
import SEOInjector from './SEOInjector';

export default function DomainPage({ domainConfig, initialProducts = [] }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Import sample products synchronously
      const { getSampleProducts } = await import('../lib/sample-products');
      const sampleProducts = getSampleProducts(domainConfig.slug);
      console.log('Loading products for domain:', domainConfig.slug, 'Products:', sampleProducts.length);
      
      // Set products immediately
      setProducts(sampleProducts);
      setLoading(false);
      
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
      setLoading(false);
    }
  }, [domainConfig.slug]);
  
  useEffect(() => {
    if (initialProducts.length > 0) {
      setProducts(initialProducts);
      setLoading(false);
    } else {
      loadProducts();
    }
  }, [domainConfig, initialProducts, loadProducts]);
  
  return (
    <>
      <SEOInjector domainConfig={domainConfig} />
      
      <div style={{
        minHeight: '100vh',
        background: domainConfig.theme.gradient,
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <DomainHeader
          domainConfig={domainConfig}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <main>
          <section style={{
            padding: '4rem 2rem 2rem',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              background: `linear-gradient(135deg, ${domainConfig.theme.accent} 0%, ${domainConfig.theme.accent}CC 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem'
            }}>
              {domainConfig.title}
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: '#888',
              fontWeight: 300
            }}>
              {domainConfig.tagline}
            </p>
          </section>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: domainConfig.theme.accent }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: `3px solid ${domainConfig.theme.accent}`,
                borderTop: '3px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }} />
              Loading products...
            </div>
          ) : (
            <ProductGrid
              products={products}
              domainConfig={domainConfig}
              searchTerm={searchTerm}
              filterCategory={filterCategory}
              onFilterChange={setFilterCategory}
            />
          )}
        </main>
        
        <Footer domainConfig={domainConfig} />
      </div>
      
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
        }
        
        a {
          color: inherit;
          text-decoration: none;
        }
        
        button {
          font-family: inherit;
        }
        
        input {
          font-family: inherit;
        }
      `}</style>
    </>
  );
}
