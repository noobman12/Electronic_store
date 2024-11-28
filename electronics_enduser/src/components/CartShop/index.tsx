"use client";
import { SETTINGS } from "@/constants/setting";
import { useCart } from "@/stores/useCart";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { formatToVND } from "@/helpers/numbersToCurrency";
import CheckoutShop from "../CheckoutShop";
import { useSearchParams } from "next/navigation";

const CartShop = () => {
  const searchParams = useSearchParams();
  const msg = searchParams.get('msg') && searchParams.get('msg') === 'success' ? 'Bạn đã đặt hàng thành công, chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất. Xin cảm ơn!' : 'Chưa có sản phẩm nào trong giỏ hàng của bạn'
  const { products,increase, decrement, removeFromCart, totalAmount } = useCart();
	if(products.length === 0 ) return (
    <div className="col-12">
        <p className="text-center cart-list-notfound">
            <span>{ msg }</span>
            <Link href="/" className="btn btn-lg btn-light">
              Đi mua sắm
            </Link>
        </p>
    </div>
  )
  return (
    <>
      <table className="table cart-items">
        <tbody>
          {products &&
            products.length > 0 &&
            products.map((p) => {

              return (
                <tr key={`cart_${p._id}`}>
                  <td className="product-image text-center">
                    <Image
                      src={`${SETTINGS.URL_IMAGE}/${p.thumbnail}`}
                      alt={p.product_name}
                      width={300}
                      height={200}
                      priority
                    />
                    <br />
                    <br />
                    <p>
                      <button
                        className="btn btn-light btn-sm"
                        onClick={ () => removeFromCart(p._id)}
                      >
                        <span
                          className="fa fa-remove"
                          style={{ color: "#000" }}
                        >
                          Xóa
                        </span>
                      </button>
                    </p>
                  </td>
                  <td>
                    <b>
                      <Link
                        className="productName"
                        href= {`/products/${p.slug}`}
                      >
                        {p.product_name}
                      </Link>
                    </b>
                    
                  </td>
                  <td className="text-right">
                    <p className="productPriceCurrent ng-binding">{formatToVND( p.price_end ) }</p>
                    <p className="productQuantityCalc">
                      <button
                        onClick={() => decrement(p._id)}
                        type="button"
                        className="quantity-button"
                      >
                        -
                      </button>
                      <input
                        className="quantity-field"
                        value={ p.quantity}
                        readOnly
                      />
                      <button
                        type="button"
                        className="quantity-button"
                        onClick={() => increase(p._id)}
                      >
                        +
                      </button>
                    </p>
                  </td>
                </tr>
              );
            })}
            <tr className="orderTotal">
              <td colSpan={2}>
                <span className="ng-binding">Tổng tiền </span>
              </td>
              <td>
                <p className="ng-binding">{ formatToVND(totalAmount) }</p>
              </td>
            </tr>
        </tbody>
      </table>
      <CheckoutShop />
    </>
  );
};

export default CartShop;
