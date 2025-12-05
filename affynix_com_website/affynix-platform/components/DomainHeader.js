'use client';

/**
 * DOMAIN HEADER COMPONENT
 * Context-aware navigation with cross-domain linking
 */

import { useState, useEffect } from 'react';
import { getAllDomains } from '../lib/domain-config.js';
import { trackCrossDomainNavigation } from '../lib/analytics.js';

export default function DomainHeader({ domainConfig, onSearchChange, searchTerm }) {
  const [mounted, setMounted] = useState(false);
  const [showDomainMenu, setShowDomainMenu] = useState(false);
  const allDomains = getAllDomains();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleDomainChange = (newDomain) => {
    if (newDomain !== window.location.hostname) {
      // Track cross-domain navigation
      trackCrossDomainNavigation(window.location.hostname, newDomain);
      
      // Navigate to new domain
      window.location.href = `https://${newDomain}`;
    }
  };
  
  const handleNetworkLinkClick = (link) => {
    // Track cross-domain navigation
    trackCrossDomainNavigation(window.location.hostname, link.domain);
    
    // Navigate to link
    window.location.href = link.url;
  };
  
  return (
    <header 
      suppressHydrationWarning={true}
      style={{
        position: 'sticky',
        top: 0,
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${domainConfig.theme.accent}20`,
        padding: '1rem 2rem',
        zIndex: 1000
      }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <a 
          href="https://affynix.com" 
          style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: domainConfig.theme.accent,
            textDecoration: 'none',
            letterSpacing: '0.5px'
          }}
        >
          AFFYNIX
        </a>
        
        {/* Search and Domain Controls */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Search Input */}
          <input
            type="search"
            placeholder="Search deals"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              background: '#1A1A1A',
              border: `2px solid ${domainConfig.theme.accent}`,
              color: '#fff',
              padding: '0.8rem 1.2rem',
              borderRadius: '6px',
              width: '300px',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          />
          
          {/* Domain Switcher */}
          {mounted && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowDomainMenu(!showDomainMenu)}
                style={{
                  background: '#1A1A1A',
                  color: domainConfig.theme.accent,
                  border: `2px solid ${domainConfig.theme.accent}`,
                  padding: '0.8rem 1.2rem',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {domainConfig.name}
                <span style={{ fontSize: '0.8rem' }}>▼</span>
              </button>
              
              {showDomainMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: '#1A1A1A',
                  border: `1px solid ${domainConfig.theme.accent}`,
                  borderRadius: '4px',
                  minWidth: '200px',
                  zIndex: 1001,
                  marginTop: '0.25rem'
                }}>
                  {allDomains.map(domain => {
                    const domainName = domain.split('.')[0];
                    const isCurrent = domain === window.location.hostname;
                    
                    return (
                      <button
                        key={domain}
                        onClick={() => handleDomainChange(domain)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          background: isCurrent ? domainConfig.theme.accent : 'transparent',
                          color: isCurrent ? '#0A0A0A' : '#fff',
                          border: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span style={{ textTransform: 'capitalize' }}>{domainName}</span>
                        {isCurrent && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          
        </div>
      </div>
      
      
      {/* Close domain menu when clicking outside */}
      {showDomainMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000
          }}
          onClick={() => setShowDomainMenu(false)}
        />
      )}
    </header>
  );
}
