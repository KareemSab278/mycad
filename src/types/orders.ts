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

export type DeliveryScheduleOrderHeader = {
  order_no: number;
  customer_no: string;
  contact_no: number;
  status_code: string;
  customer_reference: string | null;
  web_order_no: number | null;
  contract_no: number | null;
  requisition_no: number | null;
  entered_yymmdd: number | null;
  entered_hhmmss: number;
  scheduled_yymmdd: number | null;
  delivered_yymmdd: number | null;
  delivery_day: number;
  route_no: number;
  signatory: string | null;
  invoice_no: number | null;
  entered_by: string | null;
  comments: string[];
  line_count: number;
  qty_ordered: number;
  qty_delivered: number;
  order_value: number;
};

export type DeliveryScheduleOrderItem = {
  product_no: number;
  description: string;
  supplier: string | null;
  unit_price: number;
  qty_ordered: number;
  qty_adjustment: number;
  qty_delivered: number;
  line_value: number;
};

export type DeliveryScheduleOrder = {
  header: DeliveryScheduleOrderHeader;
  items: DeliveryScheduleOrderItem[];
};

export type DeliveryScheduleResponse = {
  delivery_schedule: DeliveryScheduleOrder[];
};

// still experiemtnal - do not know what the data key vals look like
export type DeliverySchedulePatch = {
  add?: SiteOrderItem[];
  remove?: SiteOrderItem[];
  update?: SiteOrderItem[];
};