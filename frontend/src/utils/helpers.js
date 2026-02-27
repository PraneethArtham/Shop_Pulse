/**
 * Format price in Indian Rupees
 */
export const formatPrice = (price) => {
  if (price == null) return '—';
  return `₹${Number(price).toLocaleString('en-IN')}`;
};

/**
 * Render star rating string
 */
export const renderStars = (rating) => {
  if (!rating) return '';
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
};

/**
 * Truncate text to a max length
 */
export const truncate = (str, max = 60) => {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
};

/**
 * Platform color class map
 */
export const PLATFORM_COLORS = {
  Amazon:  { bg: 'rgba(255,153,0,0.1)',   color: '#ff9900' },
  Flipkart:{ bg: 'rgba(39,109,255,0.1)',  color: '#276dff' },
  Meesho:  { bg: 'rgba(158,42,204,0.1)',  color: '#9e2acc' },
};

/**
 * Category icons
 */
export const CATEGORY_ICONS = {
  Electronics: '🎧',
  Mobiles:     '📱',
  Laptops:     '💻',
  Footwear:    '👟',
  Clothing:    '👕',
  Kitchen:     '🍳',
  Beauty:      '💄',
  Books:       '📚',
  Toys:        '🧸',
  Sports:      '⚽',
  General:     '🛒',
};
