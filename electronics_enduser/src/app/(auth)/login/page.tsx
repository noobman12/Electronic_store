import LoginForm from "@/components/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập - Electronics",
  description: "Sản phẩm siêu thị điện máy Đăng nhập",
};

export default async function Page() {
  return (
    <div className="body-content bg-page">
      <div className="container">
        <div className="bstrap-df">
          <div className="row">
            <div className="offset-md-2 col-md-8">
              <section>
                <LoginForm />
              </section>
            </div>
          </div>
          <div className="clearfix pt-5" />
        </div>
      </div>
      <div className="clearfix" />
    </div>
  );
}
