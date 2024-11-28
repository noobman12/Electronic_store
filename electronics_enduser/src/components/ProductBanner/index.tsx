"use client";
import Image from "next/image";
import React from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const ProductBanner = () => {
  return (
    <div className='owlRespon-2-10 boxbanner-14'>
      <Swiper
        className='banner-list'
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={2}
        loop={false}
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
          0: {
            slidesPerView: 1,
          },
        }}
      >
        <SwiperSlide>
          {/* <div className='item banner-item banner-item-1'>
            <a target='_blank' href='/tu-lanh-big-size-sale' data-id={5283}>
              <Image
                src='https://cdn.mediamart.vn/images/banner/side-by-side-4-cua_1f3d6866.png'
                alt='Side By Side & 4 cửa'
                width={600}
                height={200}
                priority
              />
              <span
                className='banner-item-view banner-item-view-5283'
                style={{ display: "none" }}
              />
            </a>
          </div> */}
        </SwiperSlide>
        <SwiperSlide>
          {/* <div className="item banner-item banner-item-1">
                    <a
                        target="_blank"
                        href="/tu-lanh-big-size-sale"
                        data-id={5283}
                    >
                        <Image
                            src="https://cdn.mediamart.vn/images/banner/thang-vang-aqua_90461fdb.png"
                            alt="thang-vang-aqua"
                            width={600}
                            height={200}
                            priority
                        />
                        <span
                        className="banner-item-view banner-item-view-5283"
                        style={{ display: "none" }}
                        />
                    </a>
                </div> */}
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default ProductBanner;
