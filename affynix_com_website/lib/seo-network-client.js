/**
 * SEO NETWORK CLIENT SCRIPT
 * Client-side SEO enhancement and cross-domain optimization
 */

(function() {
  'use strict';
  
  // Initialize SEO network functionality
  function initSEONetwork() {
    // Track cross-domain navigation
    trackCrossDomainClicks();
    
    // Optimize internal linking
    optimizeInternalLinks();
    
    // Track user engagement
    trackUserEngagement();
    
    // Initialize lazy loading for images
    initLazyLoading();
  }
  
  // Track cross-domain navigation clicks
  function trackCrossDomainClicks() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href*="affynix.com"]');
      if (!link) return;
      
      const href = link.getAttribute('href');
      const currentDomain = window.location.hostname;
      const targetDomain = new URL(href, window.location.origin).hostname;
      
      if (targetDomain !== currentDomain) {
        // Track cross-domain navigation
        if (window.affynixAnalytics) {
          window.affynixAnalytics.track('cross_domain_navigation', {
            from_domain: currentDomain,
            to_domain: targetDomain,
            link_text: link.textContent.trim(),
            link_url: href
          });
        }
        
        // Track in Google Analytics
        if (window.gtag) {
          window.gtag('event', 'cross_domain_navigation', {
            event_category: 'navigation',
            event_label: `${currentDomain} -> ${targetDomain}`,
            custom_parameter_1: link.textContent.trim()
          });
        }
      }
    });
  }
  
  // Optimize internal linking structure
  function optimizeInternalLinks() {
    const internalLinks = document.querySelectorAll('a[href*="affynix.com"]');
    
    internalLinks.forEach(link => {
      // Add rel attributes for SEO
      if (!link.getAttribute('rel')) {
        link.setAttribute('rel', 'internal');
      }
      
      // Add title attributes for better UX
      if (!link.getAttribute('title')) {
        link.setAttribute('title', `Visit ${link.textContent.trim()} on Affynix Network`);
      }
      
      // Add data attributes for tracking
      link.setAttribute('data-affynix-link', 'true');
      link.setAttribute('data-link-type', 'internal');
    });
  }
  
  // Track user engagement metrics
  function trackUserEngagement() {
    let startTime = Date.now();
    let maxScroll = 0;
    let timeOnPage = 0;
    
    // Track scroll depth
    function trackScrollDepth() {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        // Track milestone scroll depths
        if (scrollPercent >= 25 && maxScroll < 25) {
          trackEngagement('scroll_25');
        } else if (scrollPercent >= 50 && maxScroll < 50) {
          trackEngagement('scroll_50');
        } else if (scrollPercent >= 75 && maxScroll < 75) {
          trackEngagement('scroll_75');
        } else if (scrollPercent >= 90 && maxScroll < 90) {
          trackEngagement('scroll_90');
        }
      }
    }
    
    // Track time on page
    function trackTimeOnPage() {
      timeOnPage = Math.round((Date.now() - startTime) / 1000);
      
      // Track time milestones
      if (timeOnPage === 30) {
        trackEngagement('time_30s');
      } else if (timeOnPage === 60) {
        trackEngagement('time_1m');
      } else if (timeOnPage === 300) {
        trackEngagement('time_5m');
      }
    }
    
    // Track engagement event
    function trackEngagement(eventType) {
      if (window.affynixAnalytics) {
        window.affynixAnalytics.track('user_engagement', {
          event_type: eventType,
          time_on_page: timeOnPage,
          max_scroll: maxScroll,
          page_url: window.location.href
        });
      }
      
      if (window.gtag) {
        window.gtag('event', 'user_engagement', {
          event_category: 'engagement',
          event_label: eventType,
          custom_parameter_1: timeOnPage,
          custom_parameter_2: maxScroll
        });
      }
    }
    
    // Set up event listeners
    window.addEventListener('scroll', trackScrollDepth, { passive: true });
    setInterval(trackTimeOnPage, 1000);
    
    // Track page exit
    window.addEventListener('beforeunload', function() {
      trackEngagement('page_exit');
    });
  }
  
  // Initialize lazy loading for images
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
            
            // Track image load
            if (window.affynixAnalytics) {
              window.affynixAnalytics.track('image_load', {
                image_src: img.src,
                image_alt: img.alt || 'No alt text'
              });
            }
          }
        });
      });
      
      // Observe all lazy images
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
  
  // Track product interactions
  function trackProductInteraction(action, product) {
    if (window.affynixAnalytics) {
      window.affynixAnalytics.track('product_interaction', {
        action: action,
        product_id: product.id,
        product_name: product.name,
        product_category: product.category,
        product_price: product.price
      });
    }
  }
  
  // Track modal interactions
  function trackModalInteraction(action, modalType, productId) {
    if (window.affynixAnalytics) {
      window.affynixAnalytics.track('modal_interaction', {
        action: action,
        modal_type: modalType,
        product_id: productId
      });
    }
  }
  
  // Track affiliate clicks
  function trackAffiliateClick(product) {
    if (window.affynixAnalytics) {
      window.affynixAnalytics.trackAffiliateClick(
        product.id,
        product.name,
        product.price
      );
    }
  }
  
  // Expose tracking functions globally
  window.affynixSEONetwork = {
    trackProductInteraction,
    trackModalInteraction,
    trackAffiliateClick
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSEONetwork);
  } else {
    initSEONetwork();
  }
})();
