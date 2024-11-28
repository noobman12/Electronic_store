'use client'
import { SETTINGS } from '@/constants/setting'
import useBrands from '@/stores/useBrands'
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
import noImage from '@/images/no-image.jpg';
import Skeleton from 'react-loading-skeleton'
import useCategories from '@/stores/useCategories'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { dataPrices } from '@/constants/seed'
import { TFilterPrice } from '@/types/modes'

const ProductFiltersSide = () => {
    const pathname = usePathname();
    const router = useRouter()

    const [ isShowBrands, setIshowBrands ] = useState(true)
    const [ isShowCategories, setIshowCategories ] = useState(true)
    const [ isShowPrice, setIshowPrice ] = useState(true)
    
    const [ isPageBrands, setIsPageBrands ] = useState(false)
    const [ isPageCategories, setIsPageCategories] = useState(false)

    const { brands, fetchBrands, isLoading} = useBrands()
    const {categories, fetchCategories, ...isStatus } =  useCategories();

    useEffect(() => {
        fetchBrands();
        fetchCategories();
    }, [fetchBrands, fetchCategories]);

    useEffect(() => {
        if(pathname.includes("brands")){
            setIsPageBrands(true)
        }else if(pathname.includes("categories")){
            setIsPageCategories(true)
        }
    }, [pathname]);

    const toggleShowBrands  = useCallback(() => {
        setIshowBrands(!isShowBrands)
    },[isShowBrands])

    const toggleShowCategories = useCallback(() => {
        setIshowCategories(!isShowCategories)
    },[isShowCategories])

    const toggleShowPrice = useCallback(() => {
        setIshowPrice(!isShowPrice)
    },[isShowPrice])

    const searchParams = useSearchParams();
    const [brandSlugs, setBrandSlugs] = useState<string[]>([]);
    const [categoriesSlugs, setCategoriesSlugs] = useState<string[]>([]);
    const [filterPrice, setFilterPrice] = useState<string>();

    useEffect(() => {
        const brands = searchParams.get('brands') || '';
        const initialBrandSlugs = brands.split(',').filter(Boolean);
        setBrandSlugs(initialBrandSlugs); 

        const categories = searchParams.get('categories') || '';
        const initialCategoriesSlugs = categories.split(',').filter(Boolean);
        setCategoriesSlugs(initialCategoriesSlugs); 

        const initialFilterPrice = searchParams.get('p') || '';
        setFilterPrice(initialFilterPrice); 
    }, [searchParams]);
    
    const handleCheckboxChange = useCallback((slug: string) => {
        setBrandSlugs((prevSlugs) => {
            const updatedSlugs = prevSlugs.includes(slug)
                ? prevSlugs.filter((s) => s !== slug)
                : [...prevSlugs, slug];
            return updatedSlugs; 
        });
    },[]);

    const handleCheckboxChangeCat = useCallback((slug: string) => {
        setCategoriesSlugs((prevSlugs) => {
            const updatedCategoriesSlugs = prevSlugs.includes(slug)
                ? prevSlugs.filter((s) => s !== slug)
                : [...prevSlugs, slug];
            return updatedCategoriesSlugs; 
        });
    },[]);
    const handleCheckboxChangePrice = useCallback((slug: string) => {
        setFilterPrice((prevSlugs) => {
            const updatedFilterPrice = prevSlugs === slug
                ? prevSlugs = ''
                : slug;
            return updatedFilterPrice; 
        });
    },[]);


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
    }, [brandSlugs, categoriesSlugs, router, pathname, filterPrice]);
 
  return (
    <div className="pl-filters pl-filters-deD sticky-top">
        {
            !isPageBrands &&(
                <div className="accordion-collapse pl-filterBox">
                    <div className="card">
                        <div className="card-header" id="cardHeaderBrand">
                        <h5>
                            <a
                                className="collapsed"
                                onClick={toggleShowBrands}
                            >
                            
                            Hãng <i className="fa fa-angle-down" />
                            </a>
                        </h5>
                        </div>
                        <div
                        className={`collapse ${isShowBrands ? ('show') : ''}`}
                        id="collapseBrand"
                        aria-labelledby="cardHeaderBrand"
                        >
                            <div className="card-body">
                                <ul className="list-unstyled">
                                    {   
                                        isLoading ? Array.from({ length: 10 }).map((_, index) => (
                                            <li key = {`filter_sd_br_${index}`}>
                                                <Skeleton height={38} width={160} />
                                            </li>
                                        ))
                                        : brands && brands.length > 0 && (
                                            brands.map((brand, index) => {
                                                return(
                                                    <li key = {`filter_sd_br_${index}`}>
                                                        <a
                                                        className="pa-filter pa-filter-fast pa-filter-brand pa-filter-brand-782"
                                                        >
                                                            <label className="checkbox">
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={brandSlugs.includes(brand.slug)}
                                                                    onChange={() => handleCheckboxChange(brand.slug)}
                                                                />
                                                                <Image
                                                                    src = {brand.logo_url ? `${SETTINGS.URL_IMAGE}/${brand.logo_url}` : noImage }
                                                                    alt = { brand.brand_name}
                                                                    width={160}
                                                                    height={38}
                                                                    priority
                                                                />                                    
                                                            </label>
                                                        </a>
                                                    </li>
                                                )
                                            })
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        {
            !isPageCategories && (
                <div className="accordion-collapse pl-filterBox">
                    <div className="card">
                        <div className="card-header" id="cardHeaderType">
                        <h5 className="mb-0">
                            <a
                            onClick={toggleShowCategories}
                            className="collapsed"
                            >
                            
                            Danh mục <i className="fa fa-angle-down" />
                            </a>
                        </h5>
                        </div>
                        <div
                        className={`collapse ${isShowCategories ? ('show') : ''}`}
                        id="collapseType"
                        aria-labelledby="cardHeaderType"
                        >
                            <div className="card-body">
                                <ul className="list-unstyled">
                                    {
                                        isStatus.isLoading ? Array.from({ length: 10 }).map((_, index) => (
                                            <li key = {`filter_sd_br_${index}`}>
                                                <Skeleton height={38} width={160} />
                                            </li>
                                        ))
                                        : categories && categories.length > 0 && (
                                            categories.map((category, index) => {
                                                return(
                                                    <li key= {`filter_sd_cat_${index}`}>
                                                        <a
                                                        className="pa-filter pa-filter-count pa-filter-type pa-filter-type-11"
                                                        >
                                                        
                                                        <label className="checkbox">
                                                            
                                                            <input
                                                                type="checkbox" 
                                                                checked={categoriesSlugs.includes(category.slug)}
                                                                onChange={() => handleCheckboxChangeCat(category.slug)}
                                                            />
                                                            <span>
                                                                { category.category_name}
                                                            </span>
                                                        </label>
                                                        </a>
                                                    </li>
                                                )
                                            })
                                        )
                                    }
                                </ul>
                            </div>
                        
                        </div>
                    </div>
                </div>
            )
        }
        <div className="accordion-collapse pl-filterBox">
        <div className="card">
            <div className="card-header" id="cardHeaderPriceRange">
            <h5>
                <a
                onClick={toggleShowPrice}
                className="collapsed"
                >
                
                Chọn mức giá <i className="fa fa-angle-down" />
                </a>
            </h5>
            </div>
            <div
            className={`collapse ${isShowPrice ? ('show') : ''}`}
            id="collapsePricerange"
            aria-labelledby="cardHeaderPriceRange"
            >
                <div className="card-body">
                    <ul className="list-unstyled">
                        {
                            dataPrices && dataPrices.length > 0 && dataPrices.map((price:TFilterPrice) => {
                                return(
                                    <li key = { price.id}>
                                        <span
                                        className="pa-filter pa-filter-fast pa-filter-pricerange pa-filter-pricerange-0"
                                        >
                                        
                                        <label className="checkbox">
                                            
                                            <input 
                                                type="checkbox" 
                                                checked={filterPrice === price.href}
                                                onChange={() => handleCheckboxChangePrice(price.href)}
                                            />
                                            <span> {price.title} </span>
                                        </label>
                                        </span>
                                    </li>
                                )
                            })
                        }
                        
                    </ul>
               
                </div>
            
            </div>
        </div>
        </div>
        
    </div>
  )
}


export default ProductFiltersSide