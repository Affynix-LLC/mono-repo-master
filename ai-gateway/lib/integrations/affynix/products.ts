import { affynixClient } from './client';

export async function getProductsBySubdomain(subdomain: string) {
  return affynixClient.getProducts(subdomain);
}

export async function updateProductData(productId: string, updates: any) {
  return affynixClient.updateProduct(productId, updates);
}

export async function createProductWithData(productData: {
  name: string;
  category: string;
  subdomain: string;
  description?: string;
  price?: number;
  url?: string;
}) {
  return affynixClient.createProduct(productData);
}

