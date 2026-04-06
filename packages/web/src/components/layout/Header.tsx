import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Categories', to: '/categories' },
  { label: 'Compare', to: '/compare' },
  { label: 'affynix.ai', to: 'https://affynix.ai', external: true },
];

export default function Header() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-6 px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-white">
          <span className="text-[hsl(var(--primary))] text-lg font-bold tracking-tight">
            affynix
          </span>
          <span className="hidden text-xs text-[hsl(var(--muted-foreground))] sm:block">.com</span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {NAV.map((item) =>
            item.external ? (
              <a
                key={item.to}
                href={item.to}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[hsl(var(--muted-foreground))] hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'text-sm transition-colors',
                    isActive
                      ? 'text-white font-medium'
                      : 'text-[hsl(var(--muted-foreground))] hover:text-white'
                  )
                }
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search AI tools..."
              className="h-8 w-44 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--muted))] pl-8 pr-3 text-sm text-white placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] sm:w-56"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
