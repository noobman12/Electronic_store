import { SETTINGS } from "@/constants/setting";
import { TCategory } from "@/types/modes";
import { create } from "zustand";

interface TCategories {
    categories: TCategory[];
    isLoading: boolean;
    error: string | null;
    hasFetched: boolean;
    fetchCategories: () => void;
}

const useCategories = create<TCategories>((set, get) => ({
    categories: [],
    isLoading: false,
    error: null,
    hasFetched: false,

    fetchCategories: async () => {
        if (get().hasFetched) return;

        try {
            set({ isLoading: true, error: null });
            const res = await fetch(`${SETTINGS.URL_API}/v1/categories?page=1&limit=20&sort=order&order=ASC`);
            if (!res.ok) {
                set({ isLoading: false, error: "Lỗi khi lấy danh mục", hasFetched: true });
            } else {
                const getCategories = await res.json();
                const categories_public = getCategories.data.categories_list.filter((c: TCategory) => c.isActive);
                set({ categories: categories_public, isLoading: false, hasFetched: true });
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            set({ isLoading: false, error: "Lỗi khi lấy danh mục", hasFetched: true });
        }
    }
}));

export default useCategories;