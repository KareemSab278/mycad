export type Product = {
  id: string;
  name: string;
  category: 'Ingredients' | 'Machine parts';
  unit: string;
  description: string;
};

export type SiteOrderItem = {
  productId: string;
  machineIds: string[];
  quantity: number;
};