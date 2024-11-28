'use client'
import { SETTINGS } from '@/constants/setting'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import noImage from '@/images/no-image.jpg';
import { TBrand } from '@/types/modes'
import Skeleton from 'react-loading-skeleton'

const BrandHome =  () => {
    const [brands, setBrands] = useState<TBrand[] | []>([])
    const [isLoading, setIsLoading] = useState(false)
    useEffect( () => {
        const fetchBrands = async () => {
            setIsLoading(true)
            try {
                const res = await fetch(`${SETTINGS.URL_API}/v1/brands?page=1&limit=20&sort=order&order=ASC`);
                if (!res.ok) {
                    throw new Error('Failed to fetch data');
                }
                const getBrands = await res.json();
                const brand_public = getBrands.data.brands_list.filter((b: TBrand) => b.isActive);
                setBrands(brand_public);
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        };
        fetchBrands();
    },[])

  return (
    <div className='row'>
        <div className="col-12">
            <Swiper
            className='brand-slider my-4'
            modules={[Navigation, Autoplay]}
            spaceBetween={3}
            slidesPerView={7}
            loop = { false }
            autoplay={{
                delay: 3000, 
                disableOnInteraction: false,
            }}
            breakpoints={{
                1200: {
                    slidesPerView: 7,
                    },
                1024: {
                slidesPerView: 5,
                },
                992: {
                    slidesPerView: 4,
                },
                768: {
                    slidesPerView: 3,
                },
                0: {
                    slidesPerView: 2,
                },
            }}
            >  
                {
                    isLoading ? Array.from({ length: 20 }).map((_, index) => (
                        <SwiperSlide key={`sl_brand_${index}`}>
                            <div className="brand-slider__item">
                                <Skeleton height={160} width={560} />
                            </div>
                        </SwiperSlide>
                    ))
                    : brands && brands.length > 0 ? (
                        brands.map((brand:TBrand, index) => {
                            return(
                                <SwiperSlide key= {`sl_brand_${index}`} >
                                    <div className="brand-slider__item">
                                        <Link href= {`/brands/${brand.slug}`} >
                                            <Image
                                                src = {brand.logo_url && brand.logo_url !== 'undefined' ? `${SETTINGS.URL_IMAGE}/${brand.logo_url}` : noImage }
                                                alt = { brand.brand_name }
                                                width={560}
                                                height={160}
                                                priority
                                            />
                                        </Link>
                                    </div>
                                </SwiperSlide>
                            )
                        })
                    ) : null
                } 
            </Swiper>
        </div>
    </div>
  )
}

export default BrandHome
