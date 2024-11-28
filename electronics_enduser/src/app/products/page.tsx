import Breadcrumb from "@/components/Breadcrumb";
import ProductFilters from "@/components/ProductFilters";
import ProductFiltersSide from "@/components/ProductFiltersSide";
import ProductItem from "@/components/ProductItem";
import ProductSort from "@/components/ProductSort";
import { SETTINGS } from "@/constants/settings";
import { Metadata } from "next";
import { TFilterPrice, TProduct } from "@/types/modes";
import PaginationComponent from "@/components/PaginationComponent";
import { dataPrices } from "@/constants/seed";
import { Suspense } from "react";
import ProductLoading from "@/components/ProductLoading";
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export const metadata: Metadata = {
  title: "Sản phẩm - Electronics",
  description: "Sản phẩm siêu thị điện máy",
};

export default async function ProductPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const page = searchParams.page || 1;
  const priceRange = searchParams.p || "";
  const limit = 12;
  const brand = searchParams.brands || "";
  const category = searchParams.categories || "";
  const sort = searchParams.sort || "";
  const order = searchParams.order || "";
  const search = searchParams.s || "";
  let fetchProducts;
  let pagination;
  let url = `${SETTINGS.URL_API}/v1/products?page=${page}&limit=${limit}`;
  if (sort) {
    url += `&sort=${sort}`;
  }
  if (order) {
    url += `&order=${order}`;
  }
  if (search) {
    url += `&keyword=${search}`;
  }
  if (brand) {
    url += `&brands=${brand}`;
  }
  if (category) {
    url += `&categories=${category}`;
  }
  if (priceRange.includes("tren")) {
    const priceFilter = dataPrices.find(
      (p: TFilterPrice) => p.href === priceRange
    );
    if (priceFilter) {
      url += `&min_price=${priceFilter.min}`;
    }
  } else if (priceRange.includes("duoi")) {
    const priceFilter = dataPrices.find(
      (p: TFilterPrice) => p.href === priceRange
    );
    if (priceFilter) {
      url += `&max_price=${priceFilter.max}`;
    }
  } else {
    const priceFilter = dataPrices.find(
      (p: TFilterPrice) => p.href === priceRange
    );
    if (priceFilter) {
      url += `&price=${priceFilter.min}-${priceFilter.max}`;
    }
  }
  try {
    const dataProduct = await fetch(`${url}`, {
      next: { revalidate: 60 },
    });
    fetchProducts = await dataProduct.json();
    pagination = fetchProducts.data.pagination;
  } catch (error) {
    console.error("Error fetching product:", error);
  }
  return (
    <Suspense fallback={<ProductLoading />}>
      <div className="body-content bg-page">
        <div className="container">
          <div className="wrap-product">
            <Breadcrumb pageName={"Sản phẩm"} />
            <ProductFilters />

            <div className="clearfix pt-3" />
            <div className="row">
              <div className="col-12 col-md-9">
                <ProductSort />
                <div className="row">
                  <div id="getproducts" className="col-12 col-md-12">
                    <div className="row product-list product-list-bycate mb-3">
                      {fetchProducts?.data?.products_list?.length > 0 &&
                        fetchProducts.data?.products_list.map(
                          (product: TProduct) => {
                            return (
                              <div
                                key={`child_${product._id}`}
                                className="col-6 col-md-3 col-lg-3"
                              >
                                <ProductItem product={product} />
                              </div>
                            );
                          }
                        )}
                    </div>
                    {pagination.totalRecords >= 12 && (
                      <PaginationComponent totalPages={pagination.totalPages} />
                    )}
                  </div>
                </div>
              </div>
              <div className="col-0 col-md-3">
                <ProductFiltersSide />
              </div>
            </div>
            <div className="clearfix pt-3" />
            <div className="row">
              <div className="category-viewed col-12 col-md-12" />
            </div>
            <div className="clearfix pt-3" />
            <div className="row">
              <div className="product-viewed col-12 col-md-12" />
            </div>
            <div className="clearfix pt-3" />
          </div>
        </div>
        <div className="clearfix" />
      </div>
      <div className="clearfix"></div>
    </Suspense>
  );
}