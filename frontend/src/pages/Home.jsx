import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../utils/api';
import { CATEGORY_ICONS } from '../utils/helpers';
import Loader from '../components/Loader';
import styles from './Home.module.css';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    fetchCategories()
      .then((d) => setCategories(d.categories || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden />
        <span className={styles.eyebrow}>🔥 India's Smartest Price Aggregator</span>
        <h1 className={styles.heroTitle}>
          Compare<br /><em>Every</em><br />Price
        </h1>
        <p className={styles.heroSub}>
          Real-time prices from Amazon, Flipkart, Meesho &amp; local stores — all in one place.
        </p>

        <div className={styles.stats}>
          {[
            { num: '3+',   label: 'Platforms' },
            { num: '10K+', label: 'Products' },
            { num: '500+', label: 'Local Stores' },
          ].map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statNum}>{s.num}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.platforms}>
          {['🟠 Amazon', '🔵 Flipkart', '🟣 Meesho', '🟢 Local Stores'].map((p) => (
            <span key={p} className={styles.platformBadge}>{p}</span>
          ))}
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Categories</h2>
          <span className={styles.sectionCount}>{categories.length} categories</span>
        </div>

        {loading ? (
          <Loader message="Loading categories…" />
        ) : (
          <div className={`${styles.categoriesGrid} stagger`}>
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/category/${encodeURIComponent(cat)}`}
                className={styles.catCard}
              >
                <span className={styles.catIcon}>{CATEGORY_ICONS[cat] || '🛒'}</span>
                <span className={styles.catName}>{cat}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── How it works ───────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
        </div>
        <div className={`${styles.stepsGrid} stagger`}>
          {[
            { icon: '🔍', step: '01', title: 'Search a Product', desc: 'Type any product name — phone, laptop, headphones, anything.' },
            { icon: '🤖', step: '02', title: 'We Aggregate Prices', desc: 'Our scrapers pull real-time prices from all major platforms.' },
            { icon: '📍', step: '03', title: 'Find Local Stores', desc: 'See nearby stores carrying the product with live stock info.' },
            { icon: '💰', step: '04', title: 'Save Money', desc: 'Pick the best deal from online or local — always pay less.' },
          ].map((s) => (
            <div key={s.step} className={styles.stepCard}>
              <div className={styles.stepNum}>{s.step}</div>
              <div className={styles.stepIcon}>{s.icon}</div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
