export default function Hero({ config }) {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects */}
      <div 
        className="absolute inset-0 bg-gradient-to-b to-transparent"
        style={{
          background: `linear-gradient(to bottom, ${config.theme.primary}80, transparent)`
        }}
      />
      
      <div className="relative max-w-4xl mx-auto text-center">
        {/* Title - White text, playful & SEO-friendly */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          {config.title}
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/70 mb-8 font-light">
          {config.tagline}
        </p>

        {/* CTA Button with Theme Colors */}
        <button 
          className="font-bold text-lg px-8 py-4 rounded-lg transition-all hover:scale-105"
          style={{
            backgroundColor: config.theme.accent,
            color: config.theme.primary,
            boxShadow: `0 0 20px ${config.theme.accent}40`
          }}
        >
          Browse Solutions
        </button>
      </div>
    </section>
  );
}
