import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Clock, Zap, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { fetchAffiliateBySlug, logClick } from '@/lib/api';
import { difficultyLabel, formatEvidencePct } from '@/lib/utils';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: affiliate, isLoading, isError } = useQuery({
    queryKey: ['affiliate', slug],
    queryFn: () => fetchAffiliateBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="h-8 w-64 animate-pulse rounded bg-[hsl(var(--card))] mb-4" />
        <div className="h-4 w-full animate-pulse rounded bg-[hsl(var(--card))]" />
      </div>
    );
  }

  if (isError || !affiliate) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center text-[hsl(var(--muted-foreground))]">
        Product not found.
      </div>
    );
  }

  const handleClickout = () => {
    logClick({
      event_type: 'affiliate_clickout',
      affiliate_id: affiliate.affiliate_id,
      page_url: window.location.href,
      placement: 'product_page',
      session_id: null,
    });
  };

  return (
    <>
      <Helmet>
        <title>{affiliate.product_name} — Affynix</title>
        <meta name="description" content={affiliate.short_summary} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: affiliate.product_name,
            description: affiliate.short_summary,
            url: affiliate.website_url,
            applicationCategory: 'BusinessApplication',
          })}
        </script>
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <nav className="mb-6 text-sm text-[hsl(var(--muted-foreground))]">
          <Link to="/categories" className="hover:text-white">Categories</Link>
          <span className="mx-2">/</span>
          <Link to={`/categories/${affiliate.category}`} className="hover:text-white capitalize">
            {affiliate.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">{affiliate.product_name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8 flex items-start gap-4">
          {affiliate.logo_url && (
            <img
              src={affiliate.logo_url}
              alt={`${affiliate.product_name} logo`}
              className="h-14 w-14 rounded-xl object-contain bg-[hsl(var(--card))] p-1"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{affiliate.product_name}</h1>
            <p className="text-[hsl(var(--muted-foreground))]">{affiliate.vendor_name}</p>
          </div>
          <a
            href={affiliate.affiliate_url}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            onClick={handleClickout}
            className="flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-5 py-2.5 text-sm font-medium text-white hover:bg-[hsl(var(--primary))]/90 transition-colors"
          >
            Visit Site <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Evidence banner */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Metric
            label="Evidence Coverage"
            value={formatEvidencePct(affiliate.evidence_coverage_pct)}
          />
          <Metric label="Difficulty" value={difficultyLabel(affiliate.difficulty)} />
          {affiliate.setup_time && <Metric label="Setup Time" value={affiliate.setup_time} icon={<Clock className="h-3.5 w-3.5" />} />}
          <Metric
            label="Free Trial"
            value={
              affiliate.free_trial === true
                ? 'Yes'
                : affiliate.free_trial === false
                ? 'No'
                : 'Unknown'
            }
            icon={
              affiliate.free_trial === true ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
              ) : affiliate.free_trial === false ? (
                <XCircle className="h-3.5 w-3.5 text-red-400" />
              ) : (
                <HelpCircle className="h-3.5 w-3.5" />
              )
            }
          />
        </div>

        {/* Summary */}
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-white">Summary</h2>
          <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">{affiliate.short_summary}</p>
        </section>

        {/* Strengths / Limitations */}
        {(affiliate.strengths || affiliate.limitations) && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {affiliate.strengths && affiliate.strengths.length > 0 && (
              <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
                <h3 className="mb-3 font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" /> Strengths
                </h3>
                <ul className="space-y-1.5">
                  {affiliate.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-[hsl(var(--muted-foreground))]">• {s}</li>
                  ))}
                </ul>
              </div>
            )}
            {affiliate.limitations && affiliate.limitations.length > 0 && (
              <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
                <h3 className="mb-3 font-semibold text-white flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-400" /> Limitations
                </h3>
                <ul className="space-y-1.5">
                  {affiliate.limitations.map((l, i) => (
                    <li key={i} className="text-sm text-[hsl(var(--muted-foreground))]">• {l}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Evidence source */}
        {affiliate.evidence_source_url && (
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            Evidence sourced from{' '}
            <a
              href={affiliate.evidence_source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              {affiliate.evidence_source_url}
            </a>
            {affiliate.evidence_captured_at_utc && (
              <> on {new Date(affiliate.evidence_captured_at_utc).toLocaleDateString()}</>
            )}
            .
          </p>
        )}

        <p className="mt-4 text-xs text-[hsl(var(--muted-foreground))]">
          Affiliate disclosure: Affynix may earn a commission if you click an affiliate link. This
          does not affect rankings or editorial content.
        </p>
      </div>
    </>
  );
}

function Metric({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1.5 text-sm">
      {icon}
      <span className="text-[hsl(var(--muted-foreground))]">{label}:</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}
