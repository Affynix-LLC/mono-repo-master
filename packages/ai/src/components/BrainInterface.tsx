import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ExternalLink, CheckCircle2, XCircle, HelpCircle, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { queryBrain, type BrainResult } from '@/lib/api';
import { cn } from '@/lib/utils';

const SESSION_ID = uuidv4(); // stable for this page load

const EXAMPLES = [
  'What AI tool helps with long-form writing?',
  'I need a voice cloning service with a free trial',
  'Best automation tool for no-code workflows',
  'AI agent platform for customer support',
];

export default function BrainInterface() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BrainResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasQueried, setHasQueried] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const q = query.trim();
    if (!q || isLoading) return;

    setIsLoading(true);
    setError(null);
    setHasQueried(true);

    try {
      const data = await queryBrain(q, SESSION_ID);
      setResults(data.results);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleExample(example: string) {
    setQuery(example);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-16">
      {/* Logo / Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight text-white">
          affynix<span className="text-[hsl(var(--primary))]">.ai</span>
        </h1>
        <p className="mt-2 text-sm text-[hsl(var(--muted))]">
          Ask anything about AI tools, apps, and services.
          <br />
          Ranked by evidence. No paid placement.
        </p>
        <a
          href="https://affynix.com"
          className="mt-3 inline-block text-xs text-[hsl(var(--muted))] hover:text-white underline transition-colors"
        >
          Browse affynix.com →
        </a>
      </motion.div>

      {/* Query box */}
      <motion.form
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="w-full max-w-2xl"
      >
        <div className="relative rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] focus-within:border-[hsl(var(--primary))]/60 transition-colors">
          <textarea
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What kind of AI product are you looking for?"
            rows={3}
            className="w-full resize-none rounded-2xl bg-transparent px-5 py-4 pr-14 text-sm text-white placeholder:text-[hsl(var(--muted))] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className={cn(
              'absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl transition-all',
              query.trim() && !isLoading
                ? 'bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))]/90'
                : 'bg-[hsl(var(--border))] text-[hsl(var(--muted))] cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Example prompts — shown before first query */}
        {!hasQueried && (
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => handleExample(ex)}
                className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-3 py-1 text-xs text-[hsl(var(--muted))] hover:text-white hover:border-[hsl(var(--primary))]/40 transition-all"
              >
                {ex}
              </button>
            ))}
          </div>
        )}
      </motion.form>

      {/* Results */}
      <div className="mt-10 w-full max-w-2xl space-y-4">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400"
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-xl bg-[hsl(var(--surface))]"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </motion.div>
          ) : (
            results.length > 0 && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <p className="text-xs text-[hsl(var(--muted))]">
                  {results.length} result{results.length !== 1 ? 's' : ''} — ranked by evidence coverage
                </p>
                {results.map((result, i) => (
                  <ResultCard key={result.affiliate.affiliate_id} result={result} rank={i + 1} />
                ))}
                <p className="pt-2 text-xs text-[hsl(var(--muted))]">
                  Affiliate disclosure: links may earn Affynix a commission. Rankings are not
                  affected by commercial relationships.
                </p>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ResultCard({ result, rank }: { result: BrainResult; rank: number }) {
  const { affiliate, rationale } = result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
      className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-5"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))]/10 text-xs font-semibold text-[hsl(var(--primary))]">
          {rank}
        </span>

        {affiliate.logo_url && (
          <img
            src={affiliate.logo_url}
            alt={affiliate.product_name}
            className="h-9 w-9 flex-shrink-0 rounded-lg object-contain bg-white/5 p-0.5"
          />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-white truncate">{affiliate.product_name}</h3>
            {affiliate.evidence_coverage_pct !== null && (
              <span className={cn(
                'flex-shrink-0 text-xs font-medium rounded-full px-2 py-0.5',
                affiliate.evidence_coverage_pct >= 70
                  ? 'bg-green-500/10 text-green-400'
                  : affiliate.evidence_coverage_pct >= 40
                  ? 'bg-yellow-500/10 text-yellow-400'
                  : 'bg-red-500/10 text-red-400'
              )}>
                {affiliate.evidence_coverage_pct}% evidence
              </span>
            )}
          </div>
          <p className="text-xs text-[hsl(var(--muted))]">{affiliate.vendor_name}</p>
        </div>
      </div>

      {/* Rationale */}
      <p className="mt-3 text-sm text-[hsl(var(--muted))] leading-relaxed italic">
        "{rationale}"
      </p>

      {/* Summary */}
      <p className="mt-2 text-sm text-white/80 leading-relaxed line-clamp-2">
        {affiliate.short_summary}
      </p>

      {/* Chips */}
      <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
        {affiliate.setup_time && (
          <span className="rounded-md border border-[hsl(var(--border))] px-2 py-0.5 text-[hsl(var(--muted))]">
            {affiliate.setup_time}
          </span>
        )}
        <span className="rounded-md border border-[hsl(var(--border))] px-2 py-0.5 flex items-center gap-1 text-[hsl(var(--muted))]">
          {affiliate.free_trial === true ? (
            <><CheckCircle2 className="h-3 w-3 text-green-400" /> Free trial</>
          ) : affiliate.free_trial === false ? (
            <><XCircle className="h-3 w-3 text-red-400" /> No trial</>
          ) : (
            <><HelpCircle className="h-3 w-3" /> Trial unknown</>
          )}
        </span>
      </div>

      {/* CTA */}
      <div className="mt-4 flex gap-2">
        <a
          href={`https://affynix.com/products/${affiliate.product_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
          className="flex-1 rounded-lg border border-[hsl(var(--border))] py-2 text-center text-xs font-medium text-white hover:bg-white/5 transition-colors"
        >
          Details on affynix.com
        </a>
        <a
          href={affiliate.affiliate_url}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          className="flex items-center gap-1.5 rounded-lg bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/30 px-4 py-2 text-xs font-medium text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/20 transition-colors"
        >
          Visit Site <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </motion.div>
  );
}
