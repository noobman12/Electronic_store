import { TProduct } from "@/types/modes";
import React from "react";

const ProductDetail = ({ product }: { product?: TProduct }) => {
  return (
    <div className='col-12 col-md-7 col-lg-7'>
      <div id='gioi-thieu-san-pham' className='product-detail-content row'>
        <div className='col-12 col-md-12'>
          <div className='pd-content'>
            <h3 className='pd-content-title'>Thông tin chi tiết</h3>
          </div>
        </div>
        <div className='col-12 col-md-12'>
          <div
            className='content-editor pd-content pd-content-seemore pd-seemore'
            dangerouslySetInnerHTML={{ __html: product?.description || "" }}
          ></div>
          <div className='clearfix' />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
