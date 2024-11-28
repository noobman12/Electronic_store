"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import ProductItem from "../ProductItem";
import { SETTINGS } from "@/constants/settings";
import { TProduct } from "@/types/modes";
import Skeleton from "react-loading-skeleton";

const ProductSale = () => {
  const [products, setProducts] = useState<TProduct[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${SETTINGS.URL_API}/v1/products?sort=order&order=ASC`
        );
        const data = await res.json();
        const productsPublic = data.data.products_list.filter(
          (item: { isShowHome: boolean; isBest: boolean }) =>
            item.isShowHome == true && item.isBest == true
        );
        setProducts(productsPublic);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className='row'>
      <div className='col-12'>
        <div className='product-1223 product-1223-11 product-box'>
          <div className='d-flex flex-wrap  mb-3'>
            <div className=' box-banner boxbanner-69 boxbanner-1223-1 w-50'>
              <div className='banner-list'>
                <div className='item banner-item banner-item-1'>
                  <a target='_blank' href='/20-10-sale' data-id={6659}>
                    <Image
                      src='https://cdn.mediamart.vn/images/banner/deal-hoi-2010-thay-loi-yeu-thuong_f876e3fe.png'
                      alt='Deal hời 20/10 thay lời yêu thương'
                      width={600}
                      height={230}
                      priority
                    />
                    <span
                      className='banner-item-view banner-item-view-6659'
                      style={{ display: "none" }}
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className='box-banner boxbanner-70 boxbanner-1223-2 w-50'>
              <div className='banner-list'>
                <div className='d-flex'>
                  <div className='item banner-item banner-item-1'>
                    <a
                      target='_blank'
                      href='/noi-com-dien/noi-com-dien-tu-10l-cuckoo-cr-0661-mau-xanh'
                      data-id={6660}
                    >
                      <Image
                        src='https://cdn.mediamart.vn/images/banner/2010-01_4eaba048.png'
                        alt='20/10 01'
                        width={300}
                        height={230}
                        priority
                      />
                    </a>
                  </div>
                  <div className='item banner-item banner-item-2'>
                    <a
                      target='_blank'
                      href='https://mediamart.vn/tu-lanh/tu-lanh-2-cua-inverter-coex-rt-4003bs-196-lit'
                      data-id={6661}
                    >
                      <Image
                        src='https://cdn.mediamart.vn/images/banner/2010-02_c0bb9a9d.png'
                        alt='20/10 02'
                        width={300}
                        height={230}
                        priority
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Swiper
            className='product-slider my-4'
            modules={[Navigation, Autoplay]}
            spaceBetween={3}
            slidesPerView={4}
            loop={false}
            navigation
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              1200: {
                slidesPerView: 5,
              },
              1024: {
                slidesPerView: 4,
              },
              992: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 2,
              },
              0: {
                slidesPerView: 1,
              },
            }}
          >
            {isLoading
              ? Array.from({ length: 20 }).map((_, index) => (
                  <SwiperSlide key={`sl_product_${index}`}>
                    <div className='product-slider__item'>
                      <Skeleton height={160} width={560} />
                    </div>
                  </SwiperSlide>
                ))
              : products && products.length > 0
              ? products.map((item: TProduct, index: number) => {
                  return (
                    <SwiperSlide key={`product_sale_${index}`}>
                      <ProductItem product={item} />
                    </SwiperSlide>
                  );
                })
              : null}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default ProductSale;
