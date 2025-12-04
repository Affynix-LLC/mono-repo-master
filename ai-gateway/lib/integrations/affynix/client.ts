import axios from 'axios';

const AFFYNIX_API_BASE = process.env.AFFYNIX_API_BASE || 'https://affynix.com/api';

export class AffynixClient {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.AFFYNIX_API_KEY || '';
    this.baseURL = AFFYNIX_API_BASE;
  }

  private async request(method: string, endpoint: string, data?: any) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    try {
      const response = await axios({
        method,
        url: `${this.baseURL}${endpoint}`,
        headers,
        data,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Affynix API error: ${error.response?.data?.message || error.message}`
      );
    }
  }

  async getProducts(subdomain?: string) {
    const endpoint = subdomain ? `/products?subdomain=${subdomain}` : '/products';
    return this.request('GET', endpoint);
  }

  async updateProduct(productId: string, data: any) {
    return this.request('PUT', `/products/${productId}`, data);
  }

  async createProduct(data: any) {
    return this.request('POST', '/products', data);
  }

  async getAnalytics(subdomain?: string, dateRange?: { start: string; end: string }) {
    const params = new URLSearchParams();
    if (subdomain) params.append('subdomain', subdomain);
    if (dateRange) {
      params.append('start', dateRange.start);
      params.append('end', dateRange.end);
    }
    const endpoint = `/analytics${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request('GET', endpoint);
  }
}

export const affynixClient = new AffynixClient();

