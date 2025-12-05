
import React, { useEffect } from "react";
import Header from "@/components/layout/Header.jsx";
import Footer from "@/components/layout/Footer.jsx";

export default function Layout({ children, currentPageName }) {
  useEffect(() => {
    document.title = 'Affynix | Automation Consultancy';
    
    // SEO Meta Tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Affynix builds intelligent automation infrastructures that remove operational friction and scale profit through precision execution.');
    }
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Affynix | Automation Consultancy & Implementation Infrastructure');
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Affynix builds intelligent automation infrastructures that remove operational friction and scale profit through precision execution.');
    }
    
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute('content', '#0E0E0E');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0B]">
      <style>{`
        .gradient-gold-molten {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      <Header />
      <main className="pt-24">{children}</main>
      <Footer />
    </div>
  );
}
