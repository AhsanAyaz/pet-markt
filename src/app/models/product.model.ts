export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stripePriceId: string;
  variations?: ProductVariation[];
}

export interface ProductVariation {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariation?: ProductVariation;
}
