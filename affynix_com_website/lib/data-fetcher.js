/**
 * CENTRALIZED DATA FETCHER
 * Fetches products from data.affynix.com API
 */

export async function fetchProducts(domain, options = {}) {
  try {
    const { category = 'All', search = '', limit = 50 } = options;
    
    // Build query parameters
    const params = new URLSearchParams({
      domain,
      ...(category !== 'All' && { category }),
      ...(search && { search }),
      limit: limit.toString()
    });
    
    // For development, use local API
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000/api/data/products'
      : 'https://data.affynix.com/api/products';
    
    const url = `${baseUrl}?${params}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // Add caching for better performance
      next: { revalidate: 300 } // 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Return fallback data for development
    if (process.env.NODE_ENV === 'development') {
      return {
        domain,
        totalProducts: 0,
        categories: [],
        products: []
      };
    }
    
    throw error;
  }
}

export async function fetchProductById(domain, productId) {
  try {
    const data = await fetchProducts(domain);
    const product = data.products.find(p => p.id === productId);
    
    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }
    
    return product;
    
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
}

export async function fetchCategories(domain) {
  try {
    const data = await fetchProducts(domain);
    return data.categories || [];
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Cache for better performance
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchProductsWithCache(domain, options = {}) {
  const cacheKey = `${domain}-${JSON.stringify(options)}`;
  const now = Date.now();
  
  // Check cache first
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (now - timestamp < CACHE_DURATION) {
      return data;
    }
  }
  
  // Fetch fresh data
  const data = await fetchProducts(domain, options);
  
  // Cache the result
  cache.set(cacheKey, { data, timestamp: now });
  
  return data;
}
