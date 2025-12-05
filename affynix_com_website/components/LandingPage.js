'use client';

import { useState } from 'react';
import StealthHeader from './StealthHeader';
import SEOInjector from './SEOInjector';
import Footer from './Footer';

export default function LandingPage({ domainConfig }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  const verticals = [
    { 
      slug: 'business', 
      name: 'Business', 
      title: 'Business Growth', 
      description: 'Digital marketing, e-commerce, and business development tools', 
      color: '#C9A961',
      iconPath: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' // Grid dashboard
    },
    { 
      slug: 'money', 
      name: 'Money', 
      title: 'Wealth Building', 
      description: 'Investment strategies, trading education, and financial independence', 
      color: '#2A5298',
      iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z' // Dollar sign
    },
    { 
      slug: 'health', 
      name: 'Health', 
      title: 'Fitness & Wellness', 
      description: 'Training programs, nutrition guides, and wellness solutions', 
      color: '#A91D3A',
      iconPath: 'M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z' // Flame
    },
    { 
      slug: 'tech', 
      name: 'Tech', 
      title: 'Technology & AI', 
      description: 'Coding, cybersecurity, and cutting-edge tech training', 
      color: '#3B82F6',
      iconPath: 'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z' // Code brackets
    },
    { 
      slug: 'lifestyle', 
      name: 'Lifestyle', 
      title: 'Lifestyle Mastery', 
      description: 'Personal development and life optimization', 
      color: '#3A7D3E',
      iconPath: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' // Star
    },
    { 
      slug: 'relationships', 
      name: 'Relationships', 
      title: 'Dating & Connection', 
      description: 'Attraction psychology and relationship building', 
      color: '#8B3D7C',
      iconPath: 'M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z' // Heart outline
    },
    { 
      slug: 'home', 
      name: 'Home', 
      title: 'Home & Garden', 
      description: 'Interior design, DIY projects, and landscaping', 
      color: '#9A3412',
      iconPath: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' // Home
    },
    { 
      slug: 'food', 
      name: 'Food', 
      title: 'Culinary Arts', 
      description: 'Cooking techniques and specialized diet programs', 
      color: '#9B5A3F',
      iconPath: 'M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z' // Restaurant/utensils
    },
    { 
      slug: 'outdoors', 
      name: 'Outdoors', 
      title: 'Adventure & Survival', 
      description: 'Camping, hiking, and wilderness skills', 
      color: '#2C5F2E',
      iconPath: 'M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z' // Mountain
    },
    { 
      slug: 'travel', 
      name: 'Travel', 
      title: 'Travel Mastery', 
      description: 'Travel hacking and destination guides', 
      color: '#2E5A8F',
      iconPath: 'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z' // Airplane
    },
    { 
      slug: 'leads', 
      name: 'Leads', 
      title: 'Lead Generation', 
      description: 'High-converting marketing tools and strategies', 
      color: '#C9A961',
      iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' // Target/checkmark
    },
    { 
      slug: 'edu', 
      name: 'Education', 
      title: 'Learning Solutions', 
      description: 'Educational technology and online courses', 
      color: '#1E3A8A',
      iconPath: 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z' // Graduation cap
    },
    { 
      slug: 'sports', 
      name: 'Sports', 
      title: 'Athletic Performance', 
      description: 'Sports training and fitness optimization', 
      color: '#DC2626',
      iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z' // Globe/world
    }
  ];

  const handleVerticalClick = (slug) => {
    if (typeof window !== 'undefined') {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname.includes('localhost');
      window.location.href = isLocal ? `/${slug}` : `https://${slug}.affynix.com`;
    }
  };

  return (
    <>
      <SEOInjector domainConfig={domainConfig} />
      <StealthHeader domainConfig={domainConfig} />
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Hero Section */}
        <section style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          paddingTop: '8rem',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              color: '#C9A961',
              letterSpacing: '0.5px',
              marginBottom: '3rem'
            }}>AFFYNIX</div>

            <div style={{
              fontSize: '0.875rem',
              color: '#888',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
              fontWeight: 500
            }}>CURATED SOLUTIONS NETWORK</div>

            <h1 style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #C9A961 0%, #E8D4A0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}>Transform Your Future</h1>

            <p style={{
              fontSize: 'clamp(1.25rem, 3vw, 2rem)',
              color: '#E0E0E0',
              fontWeight: 300,
              marginBottom: '3rem',
              lineHeight: 1.4
            }}>Expert-Vetted Solutions Across 13 Life Verticals</p>

            <div style={{
              maxWidth: '700px',
              margin: '0 auto 4rem',
              color: '#999',
              fontSize: '1rem',
              lineHeight: 1.7
            }}>
              <p>Discover world-class training, tools, and resources meticulously curated across business, finance, health, technology, and lifestyle domains.</p>
            </div>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '3rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            cursor: 'pointer',
            animation: 'bounce 2s infinite'
          }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#C9A961',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>Explore Categories</div>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#C9A961" 
              strokeWidth="2"
              style={{ transform: 'rotate(90deg)' }}
            >
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </section>

        {/* Verticals Grid */}
        <section style={{ padding: '4rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {verticals.map((vertical) => (
              <div
                key={vertical.slug}
                onClick={() => handleVerticalClick(vertical.slug)}
                onMouseEnter={() => setHoveredCard(vertical.slug)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: hoveredCard === vertical.slug 
                    ? `linear-gradient(135deg, ${vertical.color}15 0%, ${vertical.color}05 100%)` 
                    : 'rgba(26, 26, 26, 0.6)',
                  borderRadius: '12px',
                  padding: '2.5rem 2rem',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: hoveredCard === vertical.slug 
                    ? `1px solid ${vertical.color}` 
                    : '1px solid rgba(255, 255, 255, 0.05)',
                  transform: hoveredCard === vertical.slug ? 'translateY(-8px)' : 'translateY(0)',
                  boxShadow: hoveredCard === vertical.slug 
                    ? `0 20px 40px ${vertical.color}30` 
                    : '0 4px 12px rgba(0, 0, 0, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Background accent */}
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200%',
                  height: '200%',
                  background: `radial-gradient(circle, ${vertical.color}08 0%, transparent 70%)`,
                  opacity: hoveredCard === vertical.slug ? 1 : 0,
                  transition: 'opacity 0.4s ease',
                  pointerEvents: 'none'
                }} />

                {/* Professional SVG Icon */}
                <div style={{
                  marginBottom: '1.5rem',
                  transition: 'transform 0.3s ease',
                  transform: hoveredCard === vertical.slug ? 'scale(1.05)' : 'scale(1)',
                  position: 'relative'
                }}>
                  <svg 
                    width="48" 
                    height="48" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    style={{
                      filter: hoveredCard === vertical.slug 
                        ? `drop-shadow(0 4px 12px ${vertical.color}40)` 
                        : 'none',
                      transition: 'filter 0.3s ease'
                    }}
                  >
                    <path 
                      d={vertical.iconPath} 
                      fill={hoveredCard === vertical.slug ? vertical.color : '#666'}
                      style={{ transition: 'fill 0.3s ease' }}
                    />
                  </svg>
                </div>

                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                  color: hoveredCard === vertical.slug ? vertical.color : '#fff',
                  transition: 'color 0.3s ease',
                  position: 'relative'
                }}>{vertical.title}</h3>

                <p style={{
                  color: '#888',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  marginBottom: '1.5rem',
                  position: 'relative'
                }}>{vertical.description}</p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: vertical.color,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  position: 'relative'
                }}>
                  <span>Explore {vertical.name}</span>
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={vertical.color} 
                    strokeWidth="2"
                    style={{
                      transition: 'transform 0.3s ease',
                      transform: hoveredCard === vertical.slug ? 'translateX(4px)' : 'translateX(0)'
                    }}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Footer domainConfig={domainConfig} />
      </div>

      <style jsx global>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
      `}</style>
    </>
  );
}
