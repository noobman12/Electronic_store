"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { SETTINGS } from "../../constants/settings";
import { TCategory } from "@/types/modes";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { usePathname } from "next/navigation";
const HeaderMenu = () => {
  const pathname = usePathname();
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const [isShowCat, setIsShowCat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleShowCat = () => {
    setIsShowCat(!isShowCat);
  };
  const [categories, setCategories] = useState<TCategory[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${SETTINGS.URL_API}/v1/categories/?page=1&limit=20&sort=order&order=ASC`
        );
        if (!res.ok) {
          throw new Error(`Failed fetching Categories`);
        }
        const getCategory = await res.json();
        const category_Public = getCategory.data.categories_list.filter(
          (t: TCategory) => t.isActive
        );
        setCategories(category_Public);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    // Mảng phụ thuộc rỗng có nghĩa là hàm này chỉ chạy một lần khi component được mount
    fetchCategories();
  }, []);
  useEffect(() => {
    if (pathname === "/") {
      setIsNavbarVisible(true);
    } else {
      setIsNavbarVisible(false);
    }
  }, [pathname]);
  return (
    <div className='bgheader-menu'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-3 col-0'>
            <div className='box-nav'>
              <div className='main-nav navbar navbar-expand-lg navbar-default navbar-inverse'>
                <button
                  className='navbar-toggler navbar-toggler-always'
                  type='button'
                  data-toggle='collapse'
                  data-target='#navbarMain'
                  aria-controls='navbarSupportedContent'
                  aria-expanded='true'
                  aria-label='Toggle navigation'
                  onClick={toggleShowCat}
                >
                  <span className='navbar-toggler-icon'></span>
                  <b>
                    Danh Mục<span> Sản Phẩm</span>
                  </b>
                  <i></i>
                </button>
                <div
                  className={`navbar-collapse navbar-lg collapse ${
                    isShowCat || isNavbarVisible ? "show" : ""
                  }`}
                  id='navbarMain'
                >
                  <ul className='navbar-nav'>
                    {isLoading
                      ? Array.from({ length: 20 }).map((_, index) => (
                          <li key={index} className='nav-item dropdown'>
                            <Skeleton className='w-100' height={30} />
                          </li>
                        ))
                      : categories && categories.length > 0
                      ? categories.map((category: TCategory) => (
                          <li
                            key={`menu_${category._id}`}
                            className='nav-item dropdown'
                          >
                            <span
                              className='nav-link dropdown-toggle'
                              data-toggle='dropdown'
                            >
                              {category.imageUrl ? (
                                <Image
                                  src={`${SETTINGS.URL_IMAGE}/${category.imageUrl}`}
                                  alt={category.category_name}
                                  width={21}
                                  height={30}
                                  priority
                                />
                              ) : null}
                              <span className='nav-link-text'>
                                <span>
                                  <Link href={`/categories/${category.slug}`}>
                                    {category.category_name}
                                  </Link>
                                </span>
                              </span>
                            </span>
                          </li>
                        ))
                      : null}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-9 col-0">
                <div className="box-nav-promotion">
                    <ul className="list-unstyled">
                        <li className="v-menu-item">
                            <Link href="/products" title="Tivi">
                                <span>Sản phẩm</span>
                                
                            </Link>
                        </li>
                        <li className="v-menu-item">
                            <Link href="/brands/samsung">
                                <span>Samsung</span>
                            </Link>
                        </li>
                        <li className="v-menu-item">
                            <Link href="/brands/sharp">
                                <span>Sharp</span>
                            </Link>
                        </li>
                        <li className="v-menu-item">
                            <Link href="/brands/toshiba">
                                <span>Toshiba</span>
                            </Link>
                        </li>
                        <li className="v-menu-item">
                            <Link href="/brands/panasonic">
                                <span>Panasonic</span>
                            </Link>
                        </li>
                        <li className="v-menu-item">
                            <Link href="/brands/hitachi">
                                <span>Hitachi</span>
                            </Link>
                        </li>
                        <li className="v-menu-item">
                            <a href="#" title="Tin tức">
                                <span><span style={{ color: '#ff0000' }}>Tin tức</span></span>
                                <span className="menu-item-view menu-item-view-791" style={{ display: 'none' }}></span>
                            </a>
                        </li>
                        <li className="v-menu-item">
                            <a  href="#" title="Siêu Sale từ 100K">
                                <span><span style={{ color: '#ff0000' }}>⚡️20.10 Deal Hời từ 99K</span></span>
                                <span className="menu-item-view menu-item-view-788" style={{ display: 'none' }}></span>
                            </a>
                        </li>
                        
                    </ul>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderMenu;
