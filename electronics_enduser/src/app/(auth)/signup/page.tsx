import SignUp from "@/components/SignUp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký - Electronics",
  description: "Sản phẩm siêu thị điện máy Đăng ký",
};

export default async function Page() {
  return (
    <div className="body-content bg-page">
      <div className="container">
        <div className="bstrap-df">
          <div className="row">
            <div className="offset-md-2 col-md-8">
              <SignUp />
            </div>
          </div>
          <div className="clearfix pt-5" />
        </div>
      </div>
      <div className="clearfix" />
    </div>
  );
}
