import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const navigate   = useNavigate();
  const location   = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <header className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        SHOP<span>PULSE</span>
      </Link>

      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search across all platforms..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className={styles.searchBtn} type="submit">
          Search
        </button>
      </form>

      <nav className={styles.nav}>
        <Link
          to="/"
          className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
        >
          Home
        </Link>
        <Link
          to="/search"
          className={`${styles.navLink} ${location.pathname === '/search' ? styles.active : ''}`}
        >
          Browse
        </Link>
      </nav>
    </header>
  );
}
