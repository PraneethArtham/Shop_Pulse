import { createContext, useContext, useState } from 'react';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  const toggle = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.master_product_id === product.master_product_id);
      return exists
        ? prev.filter((p) => p.master_product_id !== product.master_product_id)
        : [...prev, product];
    });
  };

  const isWishlisted = (id) => wishlist.some((p) => p.master_product_id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
