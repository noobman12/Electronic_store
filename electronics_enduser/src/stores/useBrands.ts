import { SETTINGS } from "@/constants/setting";
import { TBrand } from "@/types/modes";
import { create } from "zustand";

interface TBrands {
    brands: TBrand[];
    isLoading: boolean;
    error: string | null;
    hasFetched: boolean;
    fetchBrands: () => void;
}

const useBrands = create<TBrands>((set, get) => ({
    brands: [],
    isLoading: false,
    error: null,
    hasFetched: false,

    fetchBrands: async () => {
        if (get().hasFetched) return;

        try {
            set({ isLoading: true, error: null });
            const response = await fetch(`${SETTINGS.URL_API}/v1/brands?page=1&limit=20&sort=order&order=ASC`);
            if (!response.ok) {
                set({ isLoading: false, error: "Lỗi khi lấy thương hiệu", hasFetched: true });
            } else {
                const getBrands = await response.json();
                const brand_public = getBrands.data.brands_list.filter((b: TBrand) => b.isActive);
                set({ brands: brand_public, isLoading: false, hasFetched: true });
            }
        } catch (error) {
            console.error("Error fetching brands:", error);
            set({ isLoading: false, error: "Lỗi khi lấy thương hiệu", hasFetched: true });
        }
    }
}));

export default useBrands;