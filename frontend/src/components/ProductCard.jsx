import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/helpers';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const {
    master_product_id,
    product_name,
    brand,
    image_url,
    min_price,
    rating,
  } = product;

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/product/${master_product_id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/product/${master_product_id}`)}
    >
      <div className={styles.imageWrap}>
        {image_url ? (
          <img src={image_url} alt={product_name} className={styles.image} loading="lazy" />
        ) : (
          <div className={styles.imageFallback}>🛒</div>
        )}
      </div>

      <div className={styles.body}>
        {brand && <div className={styles.brand}>{brand}</div>}
        <h3 className={styles.name}>{product_name}</h3>
        <div className={styles.footer}>
          <div className={styles.price}>
            {formatPrice(min_price)}
            <span className={styles.priceFrom}> from</span>
          </div>
          {rating && (
            <div className={styles.rating}>
              ★ <span>{Number(rating).toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
