"use client";
import { SETTINGS } from "@/constants/setting";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import noImage from "@/images/no-image.jpg";
import useBrands from "@/stores/useBrands";
import Skeleton from "react-loading-skeleton";
import useCategories from "@/stores/useCategories";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { dataPrices } from "@/constants/seed";
import { TFilterPrice } from "@/types/modes";

const ProductFilters = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isShowFilterBrand, setIsShowFilterBrand] = useState(false);
  const [isShowFilterCategory, setIsShowFilterCategory] = useState(false);
  const [isShowFilterPrice, setIsShowFilterPrice] = useState(false);

  const [isPageBrands, setIsPageBrands] = useState(false);
  const [isPageCategories, setIsPageCategories] = useState(false);

  const { brands, fetchBrands, isLoading, error } = useBrands();
  const { categories, fetchCategories, ...isStatus } = useCategories();

  const toggleShowBrand = useCallback(() => {
    setIsShowFilterBrand((prev) => !prev);
    setIsShowFilterCategory(false);
    setIsShowFilterPrice(false);
  }, []);

  const toggleShowCategory = useCallback(() => {
    setIsShowFilterCategory((prev) => !prev);
    setIsShowFilterBrand(false);
    setIsShowFilterPrice(false);
  }, []);

  const toggleShowPrice = useCallback(() => {
    setIsShowFilterPrice((prev) => !prev);
    setIsShowFilterBrand(false);
    setIsShowFilterCategory(false);
  }, []);

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, [fetchBrands, fetchCategories]);

  useEffect(() => {
    if (pathname.includes("brands")) {
      setIsPageBrands(true);
    } else if (pathname.includes("categories")) {
      setIsPageCategories(true);
    }
  }, [pathname]);

  const searchParams = useSearchParams();
  const [brandSlugs, setBrandSlugs] = useState<string[]>([]);
  const [categoriesSlugs, setCategoriesSlugs] = useState<string[]>([]);
  const [filterPrice, setFilterPrice] = useState<string>();

  useEffect(() => {
    const brands = searchParams.get("brands") || "";
    const initialBrandSlugs = brands.split(",").filter(Boolean);
    setBrandSlugs(initialBrandSlugs);

    const categories = searchParams.get("categories") || "";
    const initialCategoriesSlugs = categories.split(",").filter(Boolean);
    setCategoriesSlugs(initialCategoriesSlugs);

    const initialFilterPrice = searchParams.get("p") || "";
    setFilterPrice(initialFilterPrice);
  }, [searchParams]);

  const handleCheckboxChange = useCallback(
    (slug: string) => {
      setBrandSlugs((prevSlugs) => {
        const updatedSlugs = prevSlugs.includes(slug)
          ? prevSlugs.filter((s) => s !== slug)
          : [...prevSlugs, slug];
        return updatedSlugs;
      });
    },
    [setBrandSlugs]
  );

  const handleCheckboxChangeCat = useCallback(
    (slug: string) => {
      setCategoriesSlugs((prevSlugs) => {
        const updatedCategoriesSlugs = prevSlugs.includes(slug)
          ? prevSlugs.filter((s) => s !== slug)
          : [...prevSlugs, slug];
        return updatedCategoriesSlugs;
      });
    },
    [setCategoriesSlugs]
  );

  const handleCheckboxChangePrice = useCallback((slug: string) => {
    setFilterPrice((prevSlugs) => {
      const updatedFilterPrice = prevSlugs === slug ? (prevSlugs = "") : slug;
      return updatedFilterPrice;
    });
  }, []);

  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search);
    const queries = [];

    // Thêm các tham số brands
    if (brandSlugs.length > 0) {
      queries.push(`brands=${brandSlugs.join(",")}`);
    }

    // Thêm các tham số categories
    if (categoriesSlugs.length > 0) {
      const categoriesQuery = categoriesSlugs.join(",");
      queries.push(`categories=${categoriesQuery}`);
    }

        // Thêm các tham số Price
        if (filterPrice) {
            queries.push(`p=${filterPrice}`);
        }
    
        // Thêm các tham số sort và order vào cuối
        if (currentParams.has('sort')) {
            queries.push(`sort=${currentParams.get('sort')}`);
        }
        if (currentParams.has('order')) {
            queries.push(`order=${currentParams.get('order')}`);
        }

        if (currentParams.has('s')) {
            queries.push(`s=${currentParams.get('s')}`);
        }

        if (currentParams.has('page')) {
            queries.push(`page=${currentParams.get('page')}`);
        }
    
        // Chuyển hướng nếu có tham số mới
        if (queries.length > 0) {
            const queryString = `${pathname}?${queries.join("&")}`;
            router.push(queryString);
        } else {
            // Nếu không có tham số nào, chỉ cần chuyển hướng đến pathname
            router.push(pathname);
        }
    }, [brandSlugs, categoriesSlugs, router, pathname,filterPrice]);

  return (
    <>
      <div className="row pl-filters pl-filters-deM">
        <div className="col-12 col-md-12">
          <div className="pl-filters-tabs">
            <ul className="nav nav-tabs esw-scroll-x">
              {[
                !isPageBrands && (
                  <li key="brand">
                    <a data-toggle="tab" onClick={toggleShowBrand}>
                      <span>Hãng</span>
                      <i />
                    </a>
                  </li>
                ),
                !isPageCategories && (
                  <li key="category">
                    <a data-toggle="tab" onClick={toggleShowCategory}>
                      <span>Danh mục</span>
                      <i />
                    </a>
                  </li>
                ),
              ]}
              <li>
                <a data-toggle="tab" onClick={toggleShowPrice}>
                  <span>Giá</span>
                  <i />
                </a>
              </li>
            </ul>
            <div className="tab-content pl-filter-tabcontent">
              {!isPageBrands && (
                <div
                  id="pl-filterBrand-tab"
                  className={`pl-filterBrand-tab pl-filterBox tab-pane fade ${
                    isShowFilterBrand ? "active show" : ""
                  }`}
                >
                  <a
                    onClick={toggleShowBrand}
                    className="pl-filter-tabcontent-close tab-content-close"
                    title="Đóng"
                  >
                    Đóng[x]
                  </a>
                  <div className="card">
                    <div className="card-body">
                      <ul className="list-unstyled">
                        {error && (
                          <li
                            className="alert alert-danger w-100"
                            style={{ maxWidth: "100%" }}
                          >
                            {" "}
                            Error: {error}
                          </li>
                        )}
                        {isLoading
                          ? Array.from({ length: 10 }).map((_, index) => (
                              <li key={`filter_sd_br_${index}`}>
                                <Skeleton height={38} width={160} />
                              </li>
                            ))
                          : brands &&
                            brands.length > 0 &&
                            brands.map((brand, index) => {
                              return (
                                <li key={`filter_br_${index}`}>
                                  <a className="pa-filter pa-filter-count pa-filter-brand pa-filter-brand-782">
                                    <label className="checkbox">
                                      <input
                                        type="checkbox"
                                        value={brand.slug}
                                        onChange={() =>
                                          handleCheckboxChange(brand.slug)
                                        }
                                        checked={brandSlugs.includes(
                                          brand.slug
                                        )}
                                      />
                                      <Image
                                        src={
                                          brand.logo_url
                                            ? `${SETTINGS.URL_IMAGE}/${brand.logo_url}`
                                            : noImage
                                        }
                                        alt={brand.brand_name}
                                        width={160}
                                        height={38}
                                        priority
                                      />
                                    </label>
                                  </a>
                                </li>
                              );
                            })}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {!isPageCategories && (
                <div
                  id="pl-filterType-tab"
                  className={`pl-filterType-tab pl-filterBox tab-pane fade ${
                    isShowFilterCategory ? "active show" : ""
                  }`}
                >
                  <a
                    onClick={toggleShowCategory}
                    className="pl-filter-tabcontent-close tab-content-close"
                    title="Đóng"
                  >
                    Đóng[x]
                  </a>
                  <div className="card">
                    <div className="card-body">
                      <ul className="list-unstyled">
                        {isStatus.error && (
                          <li
                            className="alert alert-danger w-100"
                            style={{ maxWidth: "100%" }}
                          >
                            {" "}
                            Error: {isStatus.error}
                          </li>
                        )}
                        {isStatus.isLoading
                          ? Array.from({ length: 10 }).map((_, index) => (
                              <li key={`filter_sd_br_${index}`}>
                                <Skeleton height={38} width={160} />
                              </li>
                            ))
                          : categories &&
                            categories.length > 0 &&
                            categories.map((category, index) => {
                              return (
                                <li key={`filter_cat_${index}`}>
                                  <a className="pa-filter pa-filter-count pa-filter-type pa-filter-type-11">
                                    <label className="checkbox">
                                      <input
                                        type="checkbox"
                                        value={category.slug}
                                        onChange={() =>
                                          handleCheckboxChangeCat(category.slug)
                                        }
                                        checked={categoriesSlugs.includes(
                                          category.slug
                                        )}
                                      />
                                      <span>{category.category_name}</span>
                                    </label>
                                  </a>
                                </li>
                              );
                            })}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div
                id="pl-filterPriceRange-tab"
                className={`pl-filterPriceRange-tab pl-filterBox tab-pane fade ${
                  isShowFilterPrice ? "active show" : ""
                }`}
              >
                <a
                  onClick={toggleShowPrice}
                  className="pl-filter-tabcontent-close tab-content-close"
                  title="Đóng"
                >
                  Đóng[x]
                </a>
                <div className="card">
                  <div className="card-body">
                    <ul className="list-unstyled">
                      {dataPrices &&
                        dataPrices.length > 0 &&
                        dataPrices.map((price: TFilterPrice) => {
                          return (
                            <li key={price.id}>
                              <span className="pa-filter pa-filter-fast pa-filter-pricerange pa-filter-pricerange-0">
                                <label className="checkbox">
                                  <input
                                    type="checkbox"
                                    checked={filterPrice === price.href}
                                    onChange={() =>
                                      handleCheckboxChangePrice(price.href)
                                    }
                                  />
                                  <span> {price.title} </span>
                                </label>
                              </span>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="clearfix pt-3" />
    </>
  );
};

export default ProductFilters;
