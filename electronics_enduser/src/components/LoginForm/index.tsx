"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { ChangeEvent, FormEvent } from "react";
import Link from "next/link";

type FormData = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const resSignIn = await signIn("credentials", {
      redirect: false, // tắt tự động chuyển, để handle lỗi login
      email: formData.email,
      password: formData.password,
      callbackUrl: callbackUrl,
    });

    if (resSignIn?.ok) {
      router.push(resSignIn.url || "/");
    } else {
      setMsg("Tài khoản hoặc mật khẩu khống đúng");
    }

    setLoading(false);
  };

  return (
    <div>
      {msg !== "" && <p className="py-3 my-4 text-orange-500">{msg}</p>}
      <form onSubmit={handleSubmit} className="frm-login">
        <h2>Đăng nhập</h2>
        <h4>Sử dụng tài khoản của bạn để đăng nhập</h4>
        <hr />
        <div
          className="text-danger validation-summary-valid"
          data-valmsg-summary="true"
        >
          <ul>
            <li style={{ display: "none" }} />
          </ul>
        </div>
        <div className="form-group row">
          <label className="col-md-4 col-form-label" htmlFor="Email">
            Địa chỉ email
          </label>
          <div className="col-md-8">
            <input
							required
              className="form-control"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              id="Email"
              name="email"
            />
            <span
              className="text-danger field-validation-valid"
              data-valmsg-for="Email"
              data-valmsg-replace="true"
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-md-4 col-form-label" htmlFor="Password">
            Mật khẩu
          </label>
          <div className="col-md-8">
            <input
							required
              className="form-control"
              type="password"
              value={formData.password || ""}
              onChange={handleChange}
              id="Password"
              name="password"
            />
          </div>
        </div>
        <div className="form-group row">
          <div className="offset-md-4 col-md-8">
					<button className="btn btn-primary">
							{loading ? (
								<>
									<i className="fa fa-refresh mr-3 fa-spin" aria-hidden="true"></i> Đang xử lý
								</>
							) : (
								'Đăng nhập'
							)}
						</button>

          </div>
        </div>
        <p>
          <Link href="/signup">Đăng ký người dùng mới</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
