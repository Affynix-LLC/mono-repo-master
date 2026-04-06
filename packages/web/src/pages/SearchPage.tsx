import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { searchAffiliates } from '@/lib/api';
import AffiliateCard from '@/components/AffiliateCard';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQ = searchParams.get('q') ?? '';
  const [inputValue, setInputValue] = useState(initialQ);

  useEffect(() => {
    setInputValue(searchParams.get('q') ?? '');
  }, [searchParams]);

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['search', initialQ],
    queryFn: () => searchAffiliates(initialQ),
    enabled: initialQ.length > 0,
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (inputValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    }
  }

  return (
    <>
      <Helmet>
        <title>{initialQ ? `"${initialQ}" — Search` : 'Search'} — Affynix</title>
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="mb-6 text-2xl font-bold text-white">Search AI Products</h1>

        <form onSubmit={handleSearch} className="mb-8 flex max-w-xl gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <input
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search tools, apps, services..."
              className="h-10 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] pl-10 pr-4 text-sm text-white placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[hsl(var(--primary))] px-5 text-sm font-medium text-white hover:bg-[hsl(var(--primary))]/90 transition-colors"
          >
            Search
          </button>
        </form>

        {initialQ && (
          <p className="mb-6 text-sm text-[hsl(var(--muted-foreground))]">
            {isLoading ? 'Searching…' : `${results.length} result${results.length !== 1 ? 's' : ''} for "${initialQ}"`}
          </p>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-xl bg-[hsl(var(--card))]" />
            ))}
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((affiliate) => (
              <AffiliateCard key={affiliate.affiliate_id} affiliate={affiliate} />
            ))}
          </div>
        )}

        {!isLoading && initialQ && results.length === 0 && (
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-10 text-center">
            <p className="text-[hsl(var(--muted-foreground))]">
              No results found for "{initialQ}".
            </p>
            <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
              Try{' '}
              <a
                href="https://affynix.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                affynix.ai
              </a>{' '}
              to ask in plain language.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
