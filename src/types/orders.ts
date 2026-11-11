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

// still experiemtnal - do not know what the data key vals look like
export type DeliverySchedulePatch = {
  add?: SiteOrderItem[];
  remove?: SiteOrderItem[];
  update?: SiteOrderItem[];
};