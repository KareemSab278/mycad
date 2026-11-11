import type { Product } from '../types';

const GetAll: (signal?: AbortSignal) => Promise<Product[]> = async () => {
  throw new Error('Products are not implemented yet.');
};

export const Products = { GetAll };
