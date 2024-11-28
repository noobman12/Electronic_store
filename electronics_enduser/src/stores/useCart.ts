import { TCart, TProductCart } from "@/types/modes";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const localName = 'cart-store'

export const useCart = create(
    persist<TCart>(
        (set,get) => ({
            products:[],
            totalAmount: 0,
            getTotalNumber: () => {
                return get().products.length;
            },
            
            calculateTotalAmount: () => {
              const products = get().products;
              const total = products.reduce((sum, product) => sum + product.quantity * product.price_end, 0);
              set({ totalAmount: total });
            },
            addToCart: (item: TProductCart) => {
                // Lấy mảng product cũ
                const products = get().products;
                // Kiểm tra xem sản phẩm cũng đã có chưa
                const existingProduct = products.find((product) => product._id === item._id);
        
                if (existingProduct) {
                  set({
                    products: products.map((product) =>
                      product._id === item._id
                        ? { ...product, quantity: product.quantity + item.quantity }
                        : product
                    ),
                  });
                } else {
                  //Nếu chưa thì thêm vào 
                  set({ products: [...products, { ...item }] });
                }
                get().calculateTotalAmount();
            },
            increase: (id: string) => {
              set({
                products: get().products.map((product) =>
                  product._id === id ? { ...product, quantity: product.quantity + 1 } : product
                ),
              });
              get().calculateTotalAmount();
            },
            decrement: (id: string) => {
              set({
                products: get().products.map((product) =>
                  product._id === id && product.quantity > 1
                    ? { ...product, quantity: product.quantity - 1 }
                    : product
                ),
              });
              get().calculateTotalAmount();
            },
            removeFromCart: (id: string) => {
              set({
                // Lọc ra id rồi cập nhật lại
                products: get().products.filter((product) => product._id !== id),
              });
              get().calculateTotalAmount();
            },
            clearCart: () => {
              set({ products: [], totalAmount: 0 });
              localStorage.removeItem(localName)
            },
        }),
        {
            name: localName,
            storage: createJSONStorage(() => localStorage),
        }
    )
)