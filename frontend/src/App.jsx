import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WishlistProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Category from './pages/Category';
import ProductDetails from './pages/ProductDetails';
import Search from './pages/Search';

export default function App() {
  return (
    <WishlistProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/"                   element={<Home />} />
            <Route path="/category/:categoryName" element={<Category />} />
            <Route path="/product/:id"        element={<ProductDetails />} />
            <Route path="/search"             element={<Search />} />
          </Routes>
        </main>
      </BrowserRouter>
    </WishlistProvider>
  );
}
