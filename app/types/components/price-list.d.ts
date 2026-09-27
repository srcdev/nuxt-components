export interface PriceItem {
  description: string;
  price: string;
  from?: boolean;
}

export interface PriceListData {
  headingtext: string;
  headingIcon?: string;
  items: PriceItem[];
}
