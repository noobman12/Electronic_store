import Breadcrumb from "@/components/Breadcrumb";
import PaginationComponent from "@/components/PaginationComponent";
import ProductFilters from "@/components/ProductFilters";
import ProductFiltersSide from "@/components/ProductFiltersSide";
import ProductItem from "@/components/ProductItem";
import ProductSort from "@/components/ProductSort";
import { dataPrices } from "@/constants/seed";
import { SETTINGS } from "@/constants/setting";
import { TFilterPrice, TProduct } from "@/types/modes";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type SearchParams = { [key: string]: string | string[] | undefined };
export async function fetchCategoryData(slug: string) {
  const url = `${SETTINGS.URL_API}/v1/products/category/${slug}`;

  try {
    const dataProduct = await fetch(`${url}`, {
      next: { revalidate: 60 },
    });
    return await dataProduct.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;
  const category = await fetchCategoryData(slug);
  if (category?.statusCode === 400) notFound();

  return {
    title: `${category?.data?.products_list[0]?.category?.category_name} - Sản phẩm`,
    description: `Sản phẩm đến từ ${category?.data?.category_name}`,
  };
}

export default async function Page(props: {
  params: { slug: string };
  searchParams: SearchParams;
}) {
  const { params, searchParams } = props;
  const resolvedSearchParams = searchParams;
  const slug = params.slug;
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = 12;

  const brand = resolvedSearchParams.brands || "";
  const category = resolvedSearchParams.categories || "";
  const priceRange = resolvedSearchParams.p || "";
  const sort = resolvedSearchParams.sort || "";
  const order = resolvedSearchParams.order || "";
  let url = `${SETTINGS.URL_API}/v1/products/category/${slug}?page=${page}&limit=${limit}`;
  if (sort) {
    url += `&sort=${sort}`;
  }
  if (order) {
    url += `&order=${order}`;
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
  const data = await fetch(url);
  const products = await data.json();
  const pagination = products.data.pagination;
  const categories = await fetchCategoryData(slug);
  const categoryName = categories.data?.category_name;
  return (
    <>
      <div className='body-content bg-page'>
        <div className='container'>
          <div className='wrap-product'>
            <Breadcrumb pageName={categoryName} />

            <ProductFilters />

            <div className='clearfix pt-3' />
            <div className='row'>
              <div className='col-12 col-md-9'>
                <ProductSort />
                <div className='row'>
                  <div id='getproducts' className='col-12 col-md-12'>
                    <div className='row product-list product-list-bycate'>
                      {products.data.products_list?.map(
                        (item: TProduct, index: number) => {
                          return (
                            <div
                              key={index}
                              className='col-6 col-md-3 col-lg-3'
                            >
                              <ProductItem product={item} />
                            </div>
                          );
                        }
                      )}
                    </div>
                    {pagination.totalPages > 1 ? (
                      <PaginationComponent totalPages={pagination.totalPages} />
                    ) : null}
                  </div>
                </div>
              </div>
              <div className='col-0 col-md-3'>
                <ProductFiltersSide />
              </div>
            </div>
            <div className='clearfix pt-3' />
            <div className='row'>
              <div className='category-viewed col-12 col-md-12' />
            </div>
            <div className='clearfix pt-3' />
            <div className='row'>
              <div className='product-viewed col-12 col-md-12' />
            </div>
            <div className='clearfix pt-3' />
          </div>
        </div>
        <div className='clearfix' />
      </div>
      <div className='clearfix'></div>
    </>
  );
}
