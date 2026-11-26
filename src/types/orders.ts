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

export type DeliveryScheduleItem = {
  customer_no: string;
  contact_no: string | number;
  site_name: string;
  route_no: string | number;
  cycle_weeks: string | number;
  delivery_weekday: string;
  last_scheduled_delivery: string;
  next_delivery_1: string;
  next_delivery_2: string;
  next_delivery_3: string;
};

export type DeliveryScheduleResponse = {
  delivery_schedule: DeliveryScheduleItem[];
};

// still experiemtnal - do not know what the data key vals look like
export type DeliverySchedulePatch = {
  add?: SiteOrderItem[];
  remove?: SiteOrderItem[];
  update?: SiteOrderItem[];
};