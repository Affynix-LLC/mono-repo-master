import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import type { Category } from '@affynix/shared';

const CATEGORIES: { slug: Category; label: string; description: string; icon: string }[] = [
  { slug: 'tools', label: 'AI Tools', description: 'Standalone software utilities and developer tools powered by AI.', icon: '🔧' },
  { slug: 'apps', label: 'AI Apps', description: 'Consumer and business applications with AI at their core.', icon: '📱' },
  { slug: 'services', label: 'AI Services', description: 'Managed, API-first, and cloud AI services for developers.', icon: '☁️' },
  { slug: 'consultancies', label: 'Consultancies', description: 'Firms that help organizations adopt and build AI.', icon: '🏢' },
  { slug: 'voice', label: 'Voice AI', description: 'Text-to-speech, speech-to-text, and voice cloning platforms.', icon: '🎙️' },
  { slug: 'agents', label: 'AI Agents', description: 'Autonomous agent frameworks and multi-agent orchestration tools.', icon: '🤖' },
  { slug: 'automation', label: 'Automation', description: 'Workflow automation and no-code AI automation platforms.', icon: '⚡' },
];

export default function CategoriesPage() {
  return (
    <>
      <Helmet>
        <title>AI Categories — Affynix</title>
        <meta name="description" content="Browse AI products by category: tools, apps, services, consultancies, voice, agents, and automation." />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-white">Categories</h1>
        <p className="mb-10 text-[hsl(var(--muted-foreground))]">
          Browse AI products by type. All rankings are based on evidence coverage.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/categories/${cat.slug}`}
              className="flex items-start gap-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 hover:border-[hsl(var(--primary))]/50 transition-all group"
            >
              <span className="text-3xl">{cat.icon}</span>
              <div>
                <h2 className="font-semibold text-white group-hover:text-[hsl(var(--primary))] transition-colors">
                  {cat.label}
                </h2>
                <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
