"use client";
import { SETTINGS } from "@/constants/settings";
import { formatToVND } from "@/helpers/numbersToCurrency";
import { useCart } from "@/stores/useCart";
import { TBrand, TCategory, TProduct } from "@/types/modes";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDesc = ({ product }: { product: TProduct }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [brand, setBrand] = useState<TBrand | null>();
  console.log("🚀 ~ ProductDesc ~ brand:", brand);
  const [category, setCategory] = useState<TCategory | null>();
  // const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Define the async function inside useEffect
    const fetchData = async () => {
      try {
        const response1 = await fetch(
          `${SETTINGS.URL_API}/v1/brands/${product.brand}`
        ); // Replace with your API URL
        if (!response1.ok) {
          throw new Error(`HTTP error! status: ${response1.status}`);
        }
        const result1 = await response1.json();
        setBrand(result1.data); // Update the state with the fetched data

        const response2 = await fetch(
          `${SETTINGS.URL_API}/v1/categories/${product.category}`
        );
        if (!response2.ok)
          throw new Error(`HTTP error! status: ${response2.status}`);
        const result2 = await response2.json();
        setCategory(result2.data); // Update the state with the fetched data
      } catch (error) {
        console.error("Error fetching product:", error);
        return null;
      } finally {
        // setLoading(false); // Stop the loading spinner
      }
    };

    fetchData(); // Call the function
  }, [product.brand, product.category]); // Empty dependency array ensures the effect runs only once
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numberValue = Number(value);
    if (!isNaN(numberValue) && numberValue >= 1) {
      setQuantity(numberValue);
    } else if (value === "") {
      setQuantity(1);
    }
  };
  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };
  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    setIsLoading(true);
    addToCart({
      _id: product._id!,
      slug: product.slug,
      product_name: product.product_name,
      price: product.price,
      discount: product.discount,
      price_end: product.price_end,
      thumbnail: product.thumbnail,
      quantity: quantity,
    });
    toast.success("Thêm vào giỏ hàng thành công!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="col-12 col-md-5 pdetail-des ">
      <div className="clearfix" />
      <div>
        <div className="pdetail-info">
          <p>
            Thương hiệu: <b>{brand?.brand_name}</b>
          </p>
          <p>
            Danh mục: <b>{category?.category_name}</b>
          </p>
        </div>
        <div className="pdetail-options"></div>

        <div className="pdetail-price">
          <div className="pdetail-price-box">
            <h3>
              {product.price_end !== null
                ? formatToVND(product.price_end)
                : "Liên hệ"}
            </h3>
            {product.discount > 0 && (
              <div className="product-price-discount">
                <p className="product-price-regular">
                  {formatToVND(product.price)}{" "}
                </p>
                <p className="product-price-saving">
                  Tiết kiệm ({product.discount}% )
                </p>
              </div>
            )}
          </div>
          <div className="order-product">
            <div className="box-quantity d-flex justify-between">
              <button
                onClick={handleDecrease}
                className="btn btn-minus w-[100px] h-[40px] border-slate-400 outline-0 shadow-none"
              >
                <i className="fa fa-minus" aria-hidden="true"></i>
              </button>
              <input
                type="number"
                className="form-control h-[40px] text-center shadow-none"
                value={quantity}
                min={1}
                onChange={handleChange}
              />

              <button
                onClick={handleIncrease}
                className="btn btn-plus w-[100px] h-[40px] border-slate-400 outline-0 shadow-none"
              >
                <i className="fa fa-plus" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.price_end === null || isLoading}
            type="button"
            className="btn btn-lg btn-add-cart redirectCart mb-3"
          >
            MUA NGAY <br />
            (Giao hàng tận nơi - Giá tốt - An toàn)
          </button>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDesc;
