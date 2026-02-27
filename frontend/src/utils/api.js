import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000',
  timeout: 15000,
});

// Request interceptor
API.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;

// ── Typed API helpers ──────────────────────────────────────────
export const fetchCategories = () =>
  API.get('/categories').then((r) => r.data);

export const fetchProductsByCategory = (category, page = 1, limit = 20, sort = null) =>
  API.get('/products', { params: { category, page, limit, sort } }).then((r) => r.data);

export const fetchProductDetails = (id) =>
  API.get(`/products/${id}`).then((r) => r.data);

export const searchProducts = (query, page = 1, limit = 20) =>
  API.get('/search', { params: { query, page, limit } }).then((r) => r.data);

export const fetchPriceComparison = (id) =>
  API.get(`/compare/${id}`).then((r) => r.data);

export const fetchPlatformProducts = (params) =>
  API.get('/platformproducts', { params }).then((r) => r.data);
