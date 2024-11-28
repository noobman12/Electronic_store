import React from 'react'
import Image from 'next/image'
const BannerAdv = () => {
  return (
    <div id="home-box1" className="col-md-4 col-12">
        <div className="home-box1 boxbanner-12">
            <div className="banner-list">
                <div className="item banner-item banner-item-1">
                    <a
                    target="_blank"
                    href="/apple-iphone-16-series"
                    data-id={6585}
                    >
                    <Image
                        src="https://cdn.mediamart.vn/images/banner/iphone-16-pro_8ca26aa2.png"
                        alt="Iphone 16 pro"
                        width={310}
                        height={145}
                        priority
                    />
                    <span
                        className="banner-item-view banner-item-view-6585"
                        style={{ display: "none" }}
                    />
                    </a>
                </div>
                <div className="item banner-item banner-item-2">
                    <a
                    target="_blank"
                    href="/laptop-tuu-truong#box-7684"
                    data-id={6320}
                    >
                    <Image
                        src="https://cdn.mediamart.vn/images/banner/laptop-tuu-truong-core-i5-i3-ryzen-5-gia-chi-tu-79-trieu_3b417ecf.png"
                        alt="Laptop Tựu Trường Core i5, i3, Ryzen 5 Giá chỉ từ 7.9 Triệu"
                        width={310}
                        height={145}
                        priority
                    />
                    <span
                        className="banner-item-view banner-item-view-6320"
                        style={{ display: "none" }}
                    />
                    </a>
                </div>
                <div className="item banner-item banner-item-3">
                    <a
                    target="_blank"
                    href="/tivi-sale-than-toc"
                    data-id={6273}
                    >
                    <Image
                        src="https://cdn.mediamart.vn/images/banner/tivi---sale-than-toc---gia-giam-soc---mua-1-tang-1-giam-gia-30-50_7ec2e533.png"
                        alt="TIVI - SALE THẦN TỐC - GIÁ GIẢM SỐC - MUA 1 TẶNG 1 + GIẢM GIÁ 30% + 50%"
                        width={310}
                        height={145}
                        priority
                    />
                    <span
                        className="banner-item-view banner-item-view-6273"
                        style={{ display: "none" }}
                    />
                    </a>
                </div>
            </div>
        </div>
    </div>
  )
}

export default BannerAdv
