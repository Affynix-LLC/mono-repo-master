import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFoundPage() {
  return (
    <>
      <Helmet><title>404 — Affynix</title></Helmet>
      <div className="flex flex-col items-center justify-center gap-4 py-32 text-center px-4">
        <p className="text-6xl font-bold text-[hsl(var(--primary))]">404</p>
        <h1 className="text-2xl font-semibold text-white">Page not found</h1>
        <p className="text-[hsl(var(--muted-foreground))]">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="mt-2 rounded-lg bg-[hsl(var(--primary))] px-6 py-2.5 text-sm font-medium text-white hover:bg-[hsl(var(--primary))]/90 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </>
  );
}
