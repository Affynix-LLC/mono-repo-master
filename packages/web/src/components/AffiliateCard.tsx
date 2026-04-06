import { Link } from 'react-router-dom';
import { ExternalLink, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { cn, slugify, difficultyLabel, formatEvidencePct } from '@/lib/utils';
import { logClick } from '@/lib/api';
import type { AffiliateCard as AffiliateCardType } from '@affynix/shared';

interface Props {
  affiliate: AffiliateCardType;
  className?: string;
}

export default function AffiliateCard({ affiliate, className }: Props) {
  const productSlug = slugify(affiliate.product_name);

  const handleClickout = (e: React.MouseEvent) => {
    e.preventDefault();
    logClick({
      event_type: 'affiliate_clickout',
      affiliate_id: affiliate.affiliate_id,
      page_url: window.location.href,
      placement: 'card',
      session_id: null,
    });
    window.open(affiliate.affiliate_url, '_blank', 'noopener,noreferrer');
  };

  const handleCardClick = () => {
    logClick({
      event_type: 'product_click',
      affiliate_id: affiliate.affiliate_id,
      page_url: window.location.href,
      placement: 'card',
      session_id: null,
    });
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 hover:border-[hsl(var(--primary))]/40 transition-all',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        {affiliate.logo_url ? (
          <img
            src={affiliate.logo_url}
            alt={`${affiliate.product_name} logo`}
            className="h-9 w-9 rounded-lg object-contain bg-[hsl(var(--muted))] p-0.5 flex-shrink-0"
          />
        ) : (
          <div className="h-9 w-9 rounded-lg bg-[hsl(var(--muted))] flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <Link
            to={`/products/${productSlug}`}
            onClick={handleCardClick}
            className="font-semibold text-white hover:text-[hsl(var(--primary))] transition-colors truncate block"
          >
            {affiliate.product_name}
          </Link>
          <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{affiliate.vendor_name}</p>
        </div>
        {affiliate.evidence_coverage_pct !== null && (
          <span
            className={cn(
              'flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
              affiliate.evidence_coverage_pct >= 70
                ? 'bg-green-500/10 text-green-400'
                : affiliate.evidence_coverage_pct >= 40
                ? 'bg-yellow-500/10 text-yellow-400'
                : 'bg-red-500/10 text-red-400'
            )}
          >
            {formatEvidencePct(affiliate.evidence_coverage_pct)}
          </span>
        )}
      </div>

      {/* Summary */}
      <p className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-2 leading-relaxed">
        {affiliate.short_summary}
      </p>

      {/* Chips */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        {affiliate.difficulty !== null && (
          <span className="rounded-md border border-[hsl(var(--border))] px-2 py-0.5 text-[hsl(var(--muted-foreground))]">
            {difficultyLabel(affiliate.difficulty)}
          </span>
        )}
        {affiliate.setup_time && (
          <span className="rounded-md border border-[hsl(var(--border))] px-2 py-0.5 text-[hsl(var(--muted-foreground))]">
            {affiliate.setup_time}
          </span>
        )}
        <span className="rounded-md border border-[hsl(var(--border))] px-2 py-0.5 flex items-center gap-1 text-[hsl(var(--muted-foreground))]">
          {affiliate.free_trial === true ? (
            <><CheckCircle2 className="h-3 w-3 text-green-400" /> Free trial</>
          ) : affiliate.free_trial === false ? (
            <><XCircle className="h-3 w-3 text-red-400" /> No trial</>
          ) : (
            <><HelpCircle className="h-3 w-3" /> Trial unknown</>
          )}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-auto flex gap-2 pt-1">
        <Link
          to={`/products/${productSlug}`}
          onClick={handleCardClick}
          className="flex-1 rounded-lg border border-[hsl(var(--border))] py-2 text-center text-xs font-medium text-white hover:bg-[hsl(var(--muted))] transition-colors"
        >
          Details
        </Link>
        <a
          href={affiliate.affiliate_url}
          onClick={handleClickout}
          rel="noopener noreferrer nofollow sponsored"
          className="flex items-center gap-1 rounded-lg bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/30 px-3 py-2 text-xs font-medium text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/20 transition-colors"
        >
          Visit <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
