import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';
import Loader, { CardSkeleton } from '../components/Loader';
import EmptyState from '../components/EmptyState';
import styles from './Search.module.css';

const POPULAR = ['iPhone 15', 'Sony Headphones', 'MacBook', 'Samsung Galaxy', 'OnePlus 12', 'boAt', 'Dell XPS'];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';

  const [query, setQuery]     = useState(initialQ);
  const [submitted, setSub]   = useState(initialQ);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const runSearch = (q) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setSearchParams({ q: q.trim() });
    setSub(q.trim());
    searchProducts(q.trim())
      .then((d) => setResults(d.results || []))
      .catch((e) => setError(e.message || 'Search failed'))
      .finally(() => setLoading(false));
  };

  // Run search when URL param changes (e.g. from navbar)
  useEffect(() => {
    if (initialQ) runSearch(initialQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(query);
  };

  return (
    <div className={styles.page}>
      {/* Search bar */}
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search products, brands, categories…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <button className={styles.searchBtn} type="submit">
          🔍 Search
        </button>
      </form>

      {/* Popular searches */}
      {!submitted && (
        <div className={styles.popular}>
          <p className={styles.popularLabel}>Popular searches</p>
          <div className={styles.popularChips}>
            {POPULAR.map((s) => (
              <button
                key={s}
                className={styles.chip}
                onClick={() => { setQuery(s); runSearch(s); }}
              >
                🔥 {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {submitted && (
        <div className={styles.resultsSection}>
          <div className={styles.resultsHeader}>
            {!loading && (
              <p className={styles.resultsCount}>
                {results.length} result{results.length !== 1 ? 's' : ''} for{' '}
                <strong>"{submitted}"</strong>
              </p>
            )}
          </div>

          {error ? (
            <EmptyState icon="⚠️" title="Search failed" subtitle={error} />
          ) : loading ? (
            <div className={styles.grid}>
              {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : results.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No results found"
              subtitle={`We couldn't find anything for "${submitted}". Try a different term.`}
            />
          ) : (
            <div className={`${styles.grid} stagger`}>
              {results.map((p) => <ProductCard key={p.master_product_id} product={p} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
