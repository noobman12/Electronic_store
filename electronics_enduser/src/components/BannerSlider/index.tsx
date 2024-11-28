"use client"
import React from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
const BannerSlider = () => {
  return (
    <div className="col-md-8 col-12">
        <div className="home-slide">

            <Swiper
            className='banner-list'
            modules={[Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            loop = { true }
            navigation
            >
                <SwiperSlide>
                    <div className="item">
                        <a href="">
                            <Image src="https://cdn.mediamart.vn/images/banner/sale-than-toc-giam-gia-soc-xem-ngay_4e79b684.png" alt="Ocean" width={640} height={450} priority />
                        </a>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="item">
                        <a href="">
                            <Image src="https://cdn.mediamart.vn/images/banner/20-10-deal-hoi-thay-yeu-thuong-xem-ngay_f711dfae.png" alt="Ocean" width={640} height={450} priority />
                        </a>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="item">
                        <a href="">
                            <Image src="https://cdn.mediamart.vn/images/banner/iphone-16-coming-soon-xem-ngay_437e1a81.png" alt="Ocean" width={640} height={450} priority />
                        </a>
                    </div>
                </SwiperSlide>
                
            </Swiper>
            
        </div>
    </div>
  )
}

export default BannerSlider
