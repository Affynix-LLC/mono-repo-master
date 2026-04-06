import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-[hsl(var(--border))] py-8 mt-16">
      <div className="mx-auto max-w-7xl px-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-[hsl(var(--muted-foreground))]">
        <p>
          &copy; {new Date().getFullYear()}{' '}
          <span className="text-white font-medium">Affynix LLC</span>. All rights reserved.
        </p>
        <nav className="flex gap-4">
          <Link to="/categories" className="hover:text-white transition-colors">Categories</Link>
          <a
            href="https://affynix.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            affynix.ai
          </a>
        </nav>
        <p className="text-xs">
          All affiliate links are disclosed. Rankings are based on evidence coverage, not paid
          placement.
        </p>
      </div>
    </footer>
  );
}
