import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductDetails } from '../utils/api';
import { formatPrice, renderStars, PLATFORM_COLORS } from '../utils/helpers';
import Breadcrumb from '../components/Breadcrumb';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import styles from './ProductDetails.module.css';

// ── Sub-components ────────────────────────────────────────────

function PlatformRow({ item, isBest }) {
  const colors = PLATFORM_COLORS[item.platform_name] || { bg: 'rgba(255,255,255,0.05)', color: '#aaa' };
  return (
    <a
      href={item.product_url || '#'}
      target="_blank"
      rel="noreferrer"
      className={`${styles.platformRow} ${isBest ? styles.bestRow : ''}`}
    >
      <span
        className={styles.platformBadge}
        style={{ background: colors.bg, color: colors.color }}
      >
        {item.platform_name}
      </span>
      {isBest && <span className={styles.bestTag}>LOWEST</span>}
      <div className={styles.platformMeta}>
        {item.seller?.seller_name && (
          <span className={styles.sellerName}>{item.seller.seller_name}</span>
        )}
        {item.rating && (
          <span className={styles.platformRating}>★ {Number(item.rating).toFixed(1)}</span>
        )}
      </div>
      <div className={styles.platformPrice}>{formatPrice(item.price)}</div>
      <span className={styles.externalIcon}>↗</span>
    </a>
  );
}

function StoreRow({ item }) {
  const store = item.store || {};
  return (
    <div className={styles.storeRow}>
      <div className={styles.storeTop}>
        <div>
          <div className={styles.storeName}>{store.store_name}</div>
          {store.address && (
            <div className={styles.storeAddress}>📍 {store.address}</div>
          )}
        </div>
        <div className={styles.storeRight}>
          <div className={styles.storePrice}>{formatPrice(item.price)}</div>
          <div className={`${styles.stockStatus} ${item.in_stock ? styles.inStock : styles.outStock}`}>
            {item.in_stock ? '✅ In Stock' : '❌ Out of Stock'}
          </div>
        </div>
      </div>
      <div className={styles.storeMeta}>
        {store.phone    && <span>📞 {store.phone}</span>}
        {store.store_rating && <span>★ {store.store_rating}</span>}
        {item.distance  && <span>🗺 {item.distance}</span>}
        {store.open_now !== undefined && (
          <span style={{ color: store.open_now ? 'var(--green)' : 'var(--red)' }}>
            {store.open_now ? '🟢 Open' : '🔴 Closed'}
          </span>
        )}
      </div>
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewTop}>
        <div className={styles.reviewAuthor}>
          <span className={styles.reviewName}>{review.reviewer_name}</span>
          {review.platform_name && (
            <span className={styles.reviewPlatform}>{review.platform_name}</span>
          )}
          {review.verified_purchase && (
            <span className={styles.verifiedBadge}>✓ Verified</span>
          )}
        </div>
        <div className={styles.reviewMeta}>
          <span className={styles.reviewStars} style={{ color: 'var(--gold)' }}>
            {renderStars(review.rating)}
          </span>
          {review.date && <span className={styles.reviewDate}>{review.date}</span>}
        </div>
      </div>
      {review.comment && <p className={styles.reviewComment}>{review.comment}</p>}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────

const TABS = [
  { id: 'online', label: '🌐 Online Platforms' },
  { id: 'local',  label: '📍 Local Stores' },
  { id: 'reviews',label: '💬 Reviews' },
];

export default function ProductDetails() {
  const { id } = useParams();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [activeTab, setTab]   = useState('online');

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProductDetails(id)
      .then(setData)
      .catch((e) => setError(e.response?.data?.detail || 'Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader message="Loading product details…" />;
  if (error || !data) return (
    <EmptyState icon="❌" title="Product not found" subtitle={error} />
  );

  const { product, platform_listings = [], local_store_listings = [] } = data;

  const sortedPlatforms = [...platform_listings].sort(
    (a, b) => (a.price || Infinity) - (b.price || Infinity)
  );
  const allReviews = platform_listings.flatMap((p) =>
    (p.reviews || []).map((r) => ({ ...r, platform_name: p.platform_name }))
  ).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  const bestPrice = sortedPlatforms[0]?.price;
  const allPrices = [
    ...platform_listings.map((p) => p.price),
    ...local_store_listings.map((l) => l.price),
  ].filter(Boolean);
  const lowestAny = allPrices.length ? Math.min(...allPrices) : null;

  return (
    <div className={styles.page}>
      <Breadcrumb crumbs={[
        { to: '/', label: 'Home' },
        ...(product.category ? [{ to: `/category/${encodeURIComponent(product.category)}`, label: product.category }] : []),
        { label: product.product_name },
      ]} />

      <div className={styles.layout}>
        {/* ── LEFT: Image + best price card ── */}
        <div className={styles.imageCol}>
          <div className={styles.imageWrap}>
            {product.image_url
              ? <img src={product.image_url} alt={product.product_name} className={styles.image} />
              : <div className={styles.imageFallback}>🛒</div>
            }
          </div>

          {lowestAny && (
            <div className={styles.bestPriceCard}>
              <div className={styles.bestPriceTop}>
                <span className={styles.bestPriceLabel}>Lowest Price Found</span>
                <span className={styles.bestTag}>BEST DEAL</span>
              </div>
              <div className={styles.bestPriceValue}>{formatPrice(lowestAny)}</div>
              <div className={styles.bestPriceSrc}>
                across all platforms &amp; local stores
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Info + tabs ── */}
        <div className={styles.infoCol}>
          {product.category && (
            <span className={styles.categoryBadge}>{product.category}</span>
          )}
          {product.brand && (
            <div className={styles.brand}>{product.brand}</div>
          )}
          <h1 className={styles.productTitle}>{product.product_name}</h1>

          {/* aggregate rating */}
          {allReviews.length > 0 && (() => {
            const avg = allReviews.reduce((s, r) => s + (r.rating || 0), 0) / allReviews.length;
            return (
              <div className={styles.ratingRow}>
                <span className={styles.stars} style={{ color: 'var(--gold)' }}>
                  {renderStars(avg)}
                </span>
                <span className={styles.ratingText}>
                  {avg.toFixed(1)} ({allReviews.length} review{allReviews.length !== 1 ? 's' : ''})
                </span>
              </div>
            );
          })()}

          {product.description && (
            <p className={styles.description}>{product.description}</p>
          )}

          <div className={styles.divider} />

          {/* Tabs */}
          <div className={styles.tabs}>
            {TABS.map((t) => {
              const count = t.id === 'online' ? platform_listings.length
                : t.id === 'local' ? local_store_listings.length
                : allReviews.length;
              return (
                <button
                  key={t.id}
                  className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                  <span className={styles.tabCount}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className={`${styles.tabContent} fade-up`} key={activeTab}>
            {activeTab === 'online' && (
              <>
                <p className={styles.tabHint}>Sorted by lowest price — click to buy</p>
                {sortedPlatforms.length === 0 ? (
                  <EmptyState icon="🌐" title="No online listings" subtitle="No platform data yet." />
                ) : (
                  <div className={`${styles.listStack} stagger`}>
                    {sortedPlatforms.map((item, i) => (
                      <PlatformRow key={item.platform_product_id} item={item} isBest={i === 0} />
                    ))}
                  </div>
                )}
                {sortedPlatforms[0] && (
                  <a
                    href={sortedPlatforms[0].product_url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.buyBtn}
                  >
                    🛒 Buy on {sortedPlatforms[0].platform_name} — {formatPrice(bestPrice)}
                  </a>
                )}
              </>
            )}

            {activeTab === 'local' && (
              <>
                <p className={styles.tabHint}>Nearby stores with stock info</p>
                {local_store_listings.length === 0 ? (
                  <EmptyState icon="📍" title="No local stores" subtitle="No nearby stores found." />
                ) : (
                  <div className={`${styles.listStack} stagger`}>
                    {local_store_listings.map((item) => (
                      <StoreRow key={item.local_product_id} item={item} />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'reviews' && (
              <>
                <p className={styles.tabHint}>Customer reviews across platforms</p>
                {allReviews.length === 0 ? (
                  <EmptyState icon="💬" title="No reviews yet" />
                ) : (
                  <div className={`${styles.listStack} stagger`}>
                    {allReviews.map((r, i) => (
                      <ReviewCard key={r.review_id || i} review={r} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
