import React from 'react'
import Image from 'next/image'

const HeaderTop = () => {
  return (
    <div className="bgcolor-2">
        <div className="container">
            <div className="row">
                <div className="col-12 col-md-12">
                    <div className="owlRespon-2 boxbanner-2">
                        <div className="banner-list">
                            <div className="item banner-item banner-item-1">
                                <a target="_blank" href="/apple-iphone-16-series" data-id="6590">
                                    <Image 
                                        src={'https://cdn.mediamart.vn/images/banner/top-iphone-16-1_3b07cc49.png' }
                                        alt="Top Iphone 16 1"
                                        width={600}
                                        height={70}
                                        priority 
                                    />
                                    <span className="banner-item-view banner-item-view-6590" style={{ display: 'none' }}></span>
                                </a>
                            </div>
                            <div className="item banner-item banner-item-2">
                                <a target="_blank" href="/apple-iphone-16-series" data-id="6591">
                                    <Image
                                        src="https://cdn.mediamart.vn/images/banner/top-iphone-16-2_eb2824f5.png"
                                        alt="Top Iphone 16 2"
                                        width={600}
                                        height={70}
                                        priority
                                    />
                                    <span className="banner-item-view banner-item-view-6591" style={{ display: 'none' }}></span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default HeaderTop
