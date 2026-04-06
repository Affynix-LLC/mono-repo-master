import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Search, ArrowRight, Zap, Shield, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Category } from '@affynix/shared';

const CATEGORIES: { slug: Category; label: string; description: string }[] = [
  { slug: 'tools', label: 'AI Tools', description: 'Standalone software utilities' },
  { slug: 'apps', label: 'AI Apps', description: 'End-user applications' },
  { slug: 'services', label: 'AI Services', description: 'Managed AI services' },
  { slug: 'consultancies', label: 'Consultancies', description: 'AI consulting firms' },
  { slug: 'voice', label: 'Voice AI', description: 'Voice & speech products' },
  { slug: 'agents', label: 'AI Agents', description: 'Autonomous agent platforms' },
  { slug: 'automation', label: 'Automation', description: 'Workflow automation tools' },
];

const PILLARS = [
  {
    icon: Shield,
    title: 'Evidence-Only',
    body: 'Every claim cites a source URL and capture date. No "best" or "leading" without proof.',
  },
  {
    icon: BarChart2,
    title: 'Ranked by Coverage',
    body: 'Products are sorted by evidence coverage %, not paid placement.',
  },
  {
    icon: Zap,
    title: 'Ask the Brain',
    body: 'Query affynix.ai in plain language. Get ranked results grounded in our product data.',
  },
];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <>
      <Helmet>
        <title>Affynix — Discover AI Products with Evidence</title>
        <meta
          name="description"
          content="Find, compare, and evaluate AI tools, apps, and services. Evidence-first rankings. No paid placement."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Discover AI products.{' '}
          <span className="text-[hsl(var(--primary))]">Trust the evidence.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-xl text-lg text-[hsl(var(--muted-foreground))]"
        >
          Affynix indexes AI tools, apps, and services with objective evidence coverage scores. No
          paid rankings. No "top 10" hype.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSearch}
          className="flex w-full max-w-md items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search AI tools, apps, services..."
              className="h-11 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] pl-10 pr-4 text-sm text-white placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
            />
          </div>
          <button
            type="submit"
            className="h-11 rounded-lg bg-[hsl(var(--primary))] px-5 text-sm font-medium text-white hover:bg-[hsl(var(--primary))]/90 transition-colors"
          >
            Search
          </button>
        </motion.form>

        <motion.a
          href="https://affynix.ai"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-1.5 text-sm text-[hsl(var(--muted-foreground))] hover:text-white transition-colors"
        >
          Or ask affynix.ai in plain language <ArrowRight className="h-3.5 w-3.5" />
        </motion.a>
      </section>

      {/* Category Grid */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="mb-6 text-lg font-semibold text-white">Browse by Category</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/categories/${cat.slug}`}
                className="flex flex-col gap-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 hover:border-[hsl(var(--primary))]/50 hover:bg-[hsl(var(--card))]/80 transition-all"
              >
                <span className="text-sm font-semibold text-white">{cat.label}</span>
                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                  {cat.description}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="mx-auto max-w-7xl px-4 pb-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
            >
              <Icon className="mb-3 h-5 w-5 text-[hsl(var(--primary))]" />
              <h3 className="mb-2 font-semibold text-white">{title}</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
