import axios, { AxiosRequestConfig } from 'axios';

export async function httpGet(args: { url: string; headers?: Record<string, string> }) {
  try {
    const config: AxiosRequestConfig = {
      headers: args.headers || {},
    };
    const response = await axios.get(args.url, config);
    return {
      status: response.status,
      data: response.data,
      headers: response.headers,
    };
  } catch (error: any) {
    throw new Error(`HTTP GET failed: ${error.message}`);
  }
}

export async function httpPost(args: {
  url: string;
  data: any;
  headers?: Record<string, string>;
}) {
  try {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        ...args.headers,
      },
    };
    const response = await axios.post(args.url, args.data, config);
    return {
      status: response.status,
      data: response.data,
      headers: response.headers,
    };
  } catch (error: any) {
    throw new Error(`HTTP POST failed: ${error.message}`);
  }
}

