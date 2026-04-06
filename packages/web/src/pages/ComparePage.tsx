import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQueries } from '@tanstack/react-query';
import { fetchAffiliateBySlug, logClick } from '@/lib/api';
import { ExternalLink, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { difficultyLabel, formatEvidencePct } from '@/lib/utils';
import type { Affiliate } from '@affynix/shared';

export default function ComparePage() {
  const { slugs } = useParams<{ slugs: string }>();
  const [slugA, slugB] = (slugs ?? '').split('-vs-');

  const results = useQueries({
    queries: [
      { queryKey: ['affiliate', slugA], queryFn: () => fetchAffiliateBySlug(slugA), enabled: !!slugA },
      { queryKey: ['affiliate', slugB], queryFn: () => fetchAffiliateBySlug(slugB), enabled: !!slugB },
    ],
  });

  const [a, b] = results.map((r) => r.data ?? null);
  const isLoading = results.some((r) => r.isLoading);

  return (
    <>
      <Helmet>
        <title>
          {a && b ? `${a.product_name} vs ${b.product_name}` : 'Compare'} — Affynix
        </title>
      </Helmet>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold text-white">
          {a && b ? (
            <>{a.product_name} <span className="text-[hsl(var(--muted-foreground))]">vs</span> {b.product_name}</>
          ) : 'Compare Products'}
        </h1>

        {isLoading && (
          <div className="grid grid-cols-2 gap-6">
            {[0, 1].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-[hsl(var(--card))]" />
            ))}
          </div>
        )}

        {!isLoading && a && b && (
          <div className="grid grid-cols-2 gap-6">
            <CompareColumn affiliate={a} />
            <CompareColumn affiliate={b} />
          </div>
        )}
      </div>
    </>
  );
}

function CompareColumn({ affiliate }: { affiliate: Affiliate }) {
  const handleClickout = () => {
    logClick({
      event_type: 'affiliate_clickout',
      affiliate_id: affiliate.affiliate_id,
      page_url: window.location.href,
      placement: 'compare_page',
      session_id: null,
    });
  };

  return (
    <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        {affiliate.logo_url && (
          <img src={affiliate.logo_url} alt={affiliate.product_name} className="h-10 w-10 rounded-lg object-contain" />
        )}
        <div>
          <h2 className="font-semibold text-white">{affiliate.product_name}</h2>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">{affiliate.vendor_name}</p>
        </div>
      </div>

      <p className="text-sm text-[hsl(var(--muted-foreground))]">{affiliate.short_summary}</p>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <CompareRow label="Evidence" value={formatEvidencePct(affiliate.evidence_coverage_pct)} />
        <CompareRow label="Difficulty" value={difficultyLabel(affiliate.difficulty)} />
        <CompareRow label="Setup Time" value={affiliate.setup_time ?? 'Unknown'} />
        <CompareRow
          label="Free Trial"
          value={affiliate.free_trial === true ? 'Yes' : affiliate.free_trial === false ? 'No' : 'Unknown'}
        />
      </div>

      {affiliate.strengths && (
        <div>
          <p className="mb-1.5 text-xs font-medium text-white flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> Strengths
          </p>
          <ul className="space-y-1">
            {affiliate.strengths.map((s, i) => (
              <li key={i} className="text-xs text-[hsl(var(--muted-foreground))]">• {s}</li>
            ))}
          </ul>
        </div>
      )}

      {affiliate.limitations && (
        <div>
          <p className="mb-1.5 text-xs font-medium text-white flex items-center gap-1">
            <XCircle className="h-3.5 w-3.5 text-red-400" /> Limitations
          </p>
          <ul className="space-y-1">
            {affiliate.limitations.map((l, i) => (
              <li key={i} className="text-xs text-[hsl(var(--muted-foreground))]">• {l}</li>
            ))}
          </ul>
        </div>
      )}

      <a
        href={affiliate.affiliate_url}
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
        onClick={handleClickout}
        className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-[hsl(var(--primary))] py-2.5 text-sm font-medium text-white hover:bg-[hsl(var(--primary))]/90 transition-colors"
      >
        Visit {affiliate.product_name} <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

function CompareRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[hsl(var(--muted))] px-3 py-2">
      <p className="text-xs text-[hsl(var(--muted-foreground))]">{label}</p>
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  );
}
