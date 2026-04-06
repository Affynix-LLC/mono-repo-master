import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { fetchAffiliatesByCategory } from '@/lib/api';
import AffiliateCard from '@/components/AffiliateCard';
import type { Category } from '@affynix/shared';

const CATEGORY_LABELS: Record<string, string> = {
  tools: 'AI Tools',
  apps: 'AI Apps',
  services: 'AI Services',
  consultancies: 'Consultancies',
  voice: 'Voice AI',
  agents: 'AI Agents',
  automation: 'Automation',
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = slug as Category;
  const label = CATEGORY_LABELS[slug ?? ''] ?? slug;

  const { data: affiliates = [], isLoading, isError } = useQuery({
    queryKey: ['affiliates', category],
    queryFn: () => fetchAffiliatesByCategory(category),
    enabled: !!slug,
  });

  return (
    <>
      <Helmet>
        <title>{label} — Affynix</title>
        <meta name="description" content={`Browse ${label} ranked by evidence coverage on Affynix.`} />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <nav className="mb-4 text-sm text-[hsl(var(--muted-foreground))]">
          <Link to="/categories" className="hover:text-white">Categories</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{label}</span>
        </nav>

        <h1 className="mb-2 text-3xl font-bold text-white">{label}</h1>
        <p className="mb-8 text-[hsl(var(--muted-foreground))]">
          Sorted by evidence coverage. All fields are vendor-declared or deterministically verified.
        </p>

        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-xl bg-[hsl(var(--card))]" />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--card))] p-8 text-center text-[hsl(var(--muted-foreground))]">
            Failed to load products. Please try again.
          </div>
        )}

        {!isLoading && !isError && affiliates.length === 0 && (
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 text-center text-[hsl(var(--muted-foreground))]">
            No products in this category yet.
          </div>
        )}

        {!isLoading && affiliates.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {affiliates.map((affiliate) => (
              <AffiliateCard key={affiliate.affiliate_id} affiliate={affiliate} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
