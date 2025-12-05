'use client';

import { useState, useEffect } from 'react';
import { getDomainConfig } from '@/lib/subdomain-config/domain-config';
import Header from './Header';
import Hero from './Hero';
import DealsList from './DealsList';
import Footer from './Footer';

/**
 * Universal Subdomain Page Component
 * 
 * Automatically detects domain and applies configuration.
 * Used across all subdomain routes: /business, /money, /health, etc.
 * 
 * Props:
 * @param {Array} products - Product data for this subdomain
 * @param {String} forceDomain - Optional: force specific domain config (for testing)
 */
export default function SubdomainPage({ products = [], forceDomain = null }) {
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get domain configuration
    const hostname = forceDomain || (typeof window !== 'undefined' ? window.location.hostname : '');
    const domainConfig = getDomainConfig(hostname);
    
    setConfig(domainConfig);
    setIsLoading(false);
  }, [forceDomain]);

  if (isLoading || !config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-gold text-xl font-semibold animate-pulse">
          Loading {forceDomain || 'subdomain'}...
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.theme.gradient}`}>
      <Header config={config} />
      <Hero config={config} />
      <DealsList products={products} config={config} />
      <Footer config={config} />
    </div>
  );
}
