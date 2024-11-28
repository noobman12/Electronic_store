import { SETTINGS } from "@/constants/setting";
import Image from "next/image";
import React from "react";

const ProductGalleries = ({ imageUrl }: { imageUrl: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [folder, imageAlt] = imageUrl.split("/", 2);
  return (
    <div id='pdetail-images' className='col-12 col-md-7 pdetail-images'>
      <div className='sp-wrap'>
        <div className='pdetail-slideproduct'>
          <a href=''>
            <picture>
              <Image
                src={`${SETTINGS.URL_IMAGE}/${imageUrl}`}
                alt={imageAlt}
                width={612}
                height={408}
                property=''
              />
            </picture>
          </a>
          <a href=''>
            <picture>
              <source
                srcSet='https://cdn.mediamart.vn/images/product/tivi-led-coex-32-inch-32f4000x-hd-ready-hdr_4ddaf9d0.jpg'
                type='image/jpeg'
              />
              <img
                src='https://cdn.mediamart.vn/images/product/tivi-led-coex-32-inch-32f4000x-hd-ready-hdr_4ddaf9d0.jpg'
                alt='Tivi LED Coex 32 inch 32F4000X, HD Ready, HDR'
              />
            </picture>
          </a>
        </div>
      </div>

      <div className='boxbanner-34'>
        <div className='banner-list'>
          <div className='item banner-item banner-item-1'>
            <a target='"_blank"' href='/#' data-id={5019}>
              <picture>
                <source
                  srcSet='https://cdn.mediamart.vn/images/banner/banner-chinh-sach---policy_45e6dce7.jpg'
                  type='image/jpeg'
                />
                <img
                  src='https://cdn.mediamart.vn/images/banner/banner-chinh-sach---policy_45e6dce7.jpg'
                  alt='Banner Chính sách - Policy'
                  width={850}
                  height={5}
                />
              </picture>
              <span
                className='banner-item-view banner-item-view-5019'
                style={{ display: "none" }}
              />
            </a>
          </div>
        </div>
      </div>
      <div className='clearfix' />
    </div>
  );
};

export default ProductGalleries;
