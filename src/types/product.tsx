

export interface ColorOption {
  id: string;
  name: string;
  value: string;
  displayName: string;
}

export interface SizeOption {
  id: string;
  name: string;
  inStock: boolean;
}

export interface SleeveOption {
  id: string;
  name: string;
  displayName: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
}

export interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface ProductVariation {
  color: string;
  sleeveType: string;
}

export interface Product {
  productId: string;
  name: string;
  description: string;
  code: string ;
  productImage: string | null;
  price: number;
  designation: string;
}