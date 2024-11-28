import CartShop from "@/components/CartShop";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Giỏ hàng - Electronics",
    description: "Sản phẩm siêu thị điện máy",
};
export default async function Page() {
    return(
        <div className="body-content bg-page">
            <div className="container">
                <div className="row justify-content-md-center">
                <div className="col-12 col-md-8">
                    <div className="wrap-order">
                        <div
                            className="row cart-list"
                        >
                            <CartShop />
                        </div>
                    </div>
                </div>
                </div>
            </div>
            <div className="clearfix" />
        </div>
    )
}