export type TCategory = {
  _id: string;
  category_name: string;
  slug: string;
  imageUrl: string;
  isActive: boolean;
};
export type TBrand = {
  _id: string;
  brand_name: string;
  slug: string;
  logo_url: string;
  isActive: boolean;
};

export type TProduct = {
    _id?: string;
    product_name: string;
    price: number;
    price_end: number;
    discount: number;
    category: string;
    brand: string;
    description: string;
    thumbnail: string;
    stock: number;
    slug: string;
    order: number;
    specifications: string;
}

export type TFilterPrice = {
    id: number,
    title: string,
    href: string,
    min: number,
    max: number,
}
export type TProductCart = {
    _id: string,
    product_name: string,
    slug: string,
    price: number,
    price_end: number,
    thumbnail: string, 
    quantity: number,
    discount: number
}
export interface TCart {
    products: TProductCart[];
    addToCart: (item: TProductCart) => void;
    getTotalNumber: () => number;
    increase: (id: string) => void;
    decrement:  (id: string)=>void;
    removeFromCart: (id: string)=> void;
    totalAmount: number;
    calculateTotalAmount : () => void;
    clearCart: () => void;
}
export type TCustomer = {
    _id: string;
    email: string;
    street: string;
    city: string;
    state: string;
    zip_code: string;
}
