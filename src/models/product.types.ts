export interface Product {
  name: string;
  description: string;
  price: number;
}

export type SortOption =
  | 'az'
  | 'za'
  | 'lohi'
  | 'hilo';
