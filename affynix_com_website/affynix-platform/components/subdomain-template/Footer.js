import Link from 'next/link';
import Image from 'next/image';

export default function Footer({ config }) {
  return (
    <footer 
      className="py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: `${config.theme.primary}80`,
        borderTop: `1px solid ${config.theme.accent}20`
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Brand with SEO Content */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo/logo1.svg"
                alt="Affynix Logo"
                className="w-8 h-8"
              />
              <div 
                className="text-2xl font-bold"
                style={{ color: config.theme.accent }}
              >
                AFFYNIX
              </div>
            </div>
            <p className="text-white/60 text-sm mb-4">
              {config.tagline}
            </p>
            <p className="text-white/50 text-xs leading-relaxed">
              Discover expert-curated {config.name.toLowerCase()} solutions, tools, and training programs. 
              Transform your {config.name.toLowerCase()} journey with proven strategies and premium resources.
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="https://legal.affynix.com/privacy" 
                  className="text-white/60 transition-colors text-sm"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                  onMouseEnter={(e) => e.target.style.color = config.theme.accent}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="https://legal.affynix.com/terms" 
                  className="text-white/60 transition-colors text-sm"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                  onMouseEnter={(e) => e.target.style.color = config.theme.accent}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="https://legal.affynix.com/affiliate-disclosure" 
                  className="text-white/60 transition-colors text-sm"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                  onMouseEnter={(e) => e.target.style.color = config.theme.accent}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}
                >
                  Affiliate Disclosure
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Affiliate Disclosure */}
        <div 
          className="border-t pt-6 mb-6"
          style={{ borderColor: `${config.theme.accent}20` }}
        >
          <p className="text-white/50 text-xs leading-relaxed">
            <strong>Affiliate Disclosure:</strong> Affynix participates in affiliate marketing programs. 
            We may earn commissions from qualifying purchases made through links on this site. 
            This does not affect the price you pay or our editorial independence. 
            We only recommend products and services we believe will provide value to our users.
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center text-white/40 text-sm">
          © {new Date().getFullYear()} Affynix. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
