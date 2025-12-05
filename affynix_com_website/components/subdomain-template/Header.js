'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SearchModal from '@/modals/SearchModal';

export default function Header({ config }) {
  const [showSearch, setShowSearch] = useState(false);
  const [showSubdomainDropdown, setShowSubdomainDropdown] = useState(false);

  const subdomains = [
    { slug: 'business', name: 'Business' },
    { slug: 'money', name: 'Money' },
    { slug: 'health', name: 'Health' },
    { slug: 'tech', name: 'Tech' },
    { slug: 'lifestyle', name: 'Lifestyle' },
    { slug: 'relationships', name: 'Relationships' },
    { slug: 'home', name: 'Home' },
    { slug: 'food', name: 'Food' },
    { slug: 'outdoors', name: 'Outdoors' },
    { slug: 'travel', name: 'Travel' },
    { slug: 'leads', name: 'Leads' },
    { slug: 'edu', name: 'Education' },
    { slug: 'sports', name: 'Sports' }
  ];

  const handleSubdomainClick = (slug) => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname || '';
      const isLocal = host === 'localhost' || host.includes('localhost');
      const isPreview = host.endsWith('.vercel.app') || host.includes('-git-');
      window.location.href = (isLocal || isPreview) ? `/${slug}` : `https://${slug}.affynix.com`;
    }
  };

  return (
    <>
      <header 
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{
          backgroundColor: `${config.theme.primary}95`,
          borderBottom: `1px solid ${config.theme.accent}20`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              href="https://affynix.com"
              className="flex items-center gap-3 transition-colors"
              style={{
                color: config.theme.accent
              }}
            >
              <img
                src="/logo/logo1.svg"
                alt="Affynix Logo"
                className="w-8 h-8"
              />
              <span className="text-2xl font-bold">AFFYNIX</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setShowSearch(true)}
                className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
              
              {/* Subdomain Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSubdomainDropdown(!showSubdomainDropdown)}
                  className="flex items-center gap-2 text-sm font-medium transition-colors"
                  style={{ color: config.theme.accent }}
                >
                  {config.name}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showSubdomainDropdown && (
                  <div 
                    className="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-lg z-50"
                    style={{
                      backgroundColor: config.theme.primary,
                      border: `1px solid ${config.theme.accent}20`
                    }}
                  >
                    <div className="py-2">
                      <Link
                        href="https://affynix.com"
                        className="block px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
                        style={{
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = `${config.theme.accent}20`}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        Main Hub
                      </Link>
                      {subdomains.map(subdomain => (
                        <button
                          key={subdomain.slug}
                          onClick={() => handleSubdomainClick(subdomain.slug)}
                          className="block w-full text-left px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
                          style={{
                            backgroundColor: subdomain.name === config.name ? `${config.theme.accent}20` : 'transparent'
                          }}
                          onMouseEnter={(e) => {
                            if (subdomain.name !== config.name) {
                              e.target.style.backgroundColor = `${config.theme.accent}20`;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (subdomain.name !== config.name) {
                              e.target.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          {subdomain.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {showSearch && <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />}
      
      {/* Click outside to close dropdown */}
      {showSubdomainDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSubdomainDropdown(false)}
        />
      )}
    </>
  );
}
