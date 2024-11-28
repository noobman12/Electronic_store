"use client";
import useCheckPageDefault from "@/helpers/checkPageDeffault";
import React from "react";
import { TProduct } from "@/types/modes";
import { SETTINGS } from "@/constants/setting";
import Image from "next/image";
import Link from "next/link";
import { formatToVND } from "@/helpers/numbersToCurrency";

const ProductItem = ({ product }: { product: TProduct }) => {
  useCheckPageDefault("products");
  let arr_specifi: string[] = [];
  if (product?.specifications) {
    arr_specifi = product.specifications.split("\n");
  }

  return (
    <div className="card item mb-4">
      <Link href={`/products/${product?.slug}`} className="product-item">
        <div className="card-img-top">
          <Image
            className="w-100"
            src={`${SETTINGS.URL_IMAGE}/${product?.thumbnail}`}
            alt={product?.product_name}
            width={300}
            height={300}
            priority
          />
        </div>
        <div className="card-body h-[200px] flex flex-col">
          <p className="card-title product-name">
            {product && product?.product_name && (
              <span>{product?.product_name}</span>
            )}
          </p>
          {arr_specifi.length > 0 && (
            <ul className="list-inline product-attributes flex gap-1">
              {arr_specifi.slice(0, 3).map((spec: string, index: number) => (
                <li className="border-2 w-100% h-100%  px-1" key={index}>
                  <span>
                    {spec.split(":").length == 2
                      ? spec.split(":")[1]
                      : spec.split(":")[0]}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="card-text product-price mt-max grow flex items-end">
            {product &&
              product.price &&
              (product.discount ? (
                <div className="flex flex-col">
                  <div
                    style={{ textDecoration: "line-through", color: "black" }}
                  >
                    {formatToVND(product.price)}
                  </div>
                  <div className="">
                    <span className="text-red-600">
                      {formatToVND(
                        product.price * (1 - product.discount / 100)
                      )}
                    </span>
                    <span
                      style={{ paddingLeft: "5px" }}
                      className="text-red-600"
                    >
                      {typeof product?.discount === "number" &&
                        product.discount > 0 && (
                          <span className="product-specialtype-box">
                            {product.discount}%
                          </span>
                        )}
                    </span>
                  </div>
                </div>
              ) : (
                <span>{formatToVND(product.price)}</span>
              ))}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductItem;
