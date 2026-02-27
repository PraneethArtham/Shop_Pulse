import { Link } from 'react-router-dom';
import styles from './Breadcrumb.module.css';

export default function Breadcrumb({ crumbs }) {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      {crumbs.map((crumb, i) => (
        <span key={i} className={styles.item}>
          {i < crumbs.length - 1 ? (
            <>
              <Link to={crumb.to} className={styles.link}>{crumb.label}</Link>
              <span className={styles.sep}>›</span>
            </>
          ) : (
            <span className={styles.current}>{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
