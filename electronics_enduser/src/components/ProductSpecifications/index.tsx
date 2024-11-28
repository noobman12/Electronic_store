"use client";
import { TProduct } from "@/types/modes";

const ProductSpecifications = ({ product }: { product: TProduct }) => {
  if (!product.specifications) return null;
  const productSpecifications = product.specifications.split("\n") || "";
  const arr_specify = productSpecifications.map((productSpecification) => {
    const [key, value] = productSpecification.split(":");
    return { key: key?.trim() || "", value: value?.trim() || "" };
  });
  return (
    <div className='col-12 col-md-5 col-lg-5'>
      <div className='row pd-attribute pd-attribute-seemore pd-seemore'>
        <h3 className='pd-attribute-title'>Thông số kỹ thuật</h3>
        <div className='col-12 col-md-12'>
          <div className='pdetail-attrs-comps'>
            <table className='table table-striped'>
              <tbody>
                <tr>
                  <th className='td-colspan-2' colSpan={2}>
                    Tổng quan
                  </th>
                </tr>
                {arr_specify.map(({ key, value }, index) => (
                  <tr key={index}>
                    <td className='pl-2 !font-normal'>{key}</td>
                    <td className='pl-2 !font-normal'>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className='row col-12'></div>
      </div>
    </div>
  );
};

export default ProductSpecifications;
