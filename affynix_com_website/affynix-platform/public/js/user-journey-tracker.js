/**
 * AFFYNIX USER JOURNEY TRACKER
 * Cross-domain user analytics and behavior tracking
 * 
 * SCALABLE ARCHITECTURE:
 * - Tracks user navigation across all network domains
 * - Session-based journey reconstruction
 * - Analytics for conversion path optimization
 * 
 * Automatically includes all domains from config
 */

import { getActiveDomains, getDomainConfig } from '../../../config/network-domains.js';

class UserJourneyTracker {
  constructor() {
    this.activeDomains = getActiveDomains();
    this.currentDomain = window.location.hostname;
    this.currentConfig = getDomainConfig(this.currentDomain);
    this.sessionId = this.getOrCreateSession();
    this.journeyKey = `affynix_journey_${this.sessionId}`;
    
    this.init();
  }
  
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.startTracking());
    } else {
      this.startTracking();
    }
  }
  
  startTracking() {
    this.recordPageView();
    this.trackEngagement();
    this.trackExits();
    this.trackConversions();
  }
  
  /**
   * Record page view in journey
   */
  recordPageView() {
    const pageView = {
      timestamp: Date.now(),
      domain: this.currentDomain,
      path: window.location.pathname,
      url: window.location.href,
      referrer: document.referrer,
      title: document.title,
      authority: this.currentConfig ? this.currentConfig.authority : 85
    };
    
    this.addToJourney(pageView);
    this.sendAnalytics('page_view', pageView);
  }
  
  /**
   * Track user engagement metrics
   */
  trackEngagement() {
    let scrollDepth = 0;
    let maxScrollDepth = 0;
    let timeOnPage = 0;
    const startTime = Date.now();
    
    // Scroll depth tracking
    const trackScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      scrollDepth = Math.round(((scrollTop + windowHeight) / documentHeight) * 100);
      maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);
    };
    
    window.addEventListener('scroll', this.throttle(trackScroll, 500));
    
    // Time on page tracking
    const trackTime = () => {
      timeOnPage = Math.round((Date.now() - startTime) / 1000);
    };
    
    setInterval(trackTime, 1000);
    
    // Send engagement data before unload
    window.addEventListener('beforeunload', () => {
      this.sendAnalytics('engagement', {
        maxScrollDepth,
        timeOnPage,
        domain: this.currentDomain,
        path: window.location.pathname
      });
    });
  }
  
  /**
   * Track exit intent and destination
   */
  trackExits() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link || !link.href) return;
      
      try {
        const targetUrl = new URL(link.href);
        const isExternal = !this.activeDomains.some(d => d.domain === targetUrl.hostname);
        
        if (isExternal) {
          this.sendAnalytics('exit_click', {
            destination: link.href,
            text: link.textContent?.trim().slice(0, 100),
            domain: this.currentDomain,
            path: window.location.pathname
          });
        }
      } catch (error) {
        // Invalid URL
      }
    });
  }
  
  /**
   * Track conversion events (affiliate clicks)
   */
  trackConversions() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link || !link.href) return;
      
      // Detect affiliate/checkout links
      const isConversion = this.isConversionLink(link.href);
      
      if (isConversion) {
        const conversionData = {
          timestamp: Date.now(),
          domain: this.currentDomain,
          path: window.location.pathname,
          destination: link.href,
          linkText: link.textContent?.trim().slice(0, 100),
          journey: this.getJourney()
        };
        
        this.sendAnalytics('conversion', conversionData);
        this.addToJourney({ type: 'conversion', ...conversionData });
      }
    });
  }
  
  /**
   * Detect if link is a conversion event
   */
  isConversionLink(href) {
    const conversionIndicators = [
      'checkout', 'cart', 'order', 'purchase', 'buy',
      'clickbank.net', 'jvzoo.com', 'warriorplus.com',
      '#checkout', '/checkout', '/order', '/buy'
    ];
    
    const lowerHref = href.toLowerCase();
    return conversionIndicators.some(indicator => lowerHref.includes(indicator));
  }
  
  /**
   * Add event to journey
   */
  addToJourney(event) {
    try {
      const journey = this.getJourney();
      journey.push(event);
      
      // Keep last 50 events
      if (journey.length > 50) {
        journey.shift();
      }
      
      sessionStorage.setItem(this.journeyKey, JSON.stringify(journey));
    } catch (error) {
      // Storage quota exceeded
      sessionStorage.removeItem(this.journeyKey);
    }
  }
  
  /**
   * Get current journey
   */
  getJourney() {
    try {
      const stored = sessionStorage.getItem(this.journeyKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }
  
  /**
   * Send analytics to server
   */
  sendAnalytics(eventType, data) {
    const payload = {
      sessionId: this.sessionId,
      eventType,
      timestamp: Date.now(),
      ...data
    };
    
    // Use sendBeacon for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/journey', JSON.stringify(payload));
    } else {
      // Fallback
      fetch('/api/analytics/journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {}); // Silent fail
    }
  }
  
  /**
   * Get or create session ID
   */
  getOrCreateSession() {
    let sessionId = sessionStorage.getItem('affynix_session');
    
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('affynix_session', sessionId);
    }
    
    return sessionId;
  }
  
  /**
   * Throttle function execution
   */
  throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    
    return function (...args) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  new UserJourneyTracker();
}

export default UserJourneyTracker;
