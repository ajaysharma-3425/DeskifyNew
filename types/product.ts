export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: "gents" | "ladies";
  images: string[];
  sizes: string[];
  stock: number;
}
