'use client'
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useState } from "react";
import { TCustomer } from "@/types/modes";
import { SETTINGS } from "@/constants/setting";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [buttonText, setButtonText] = useState("Đăng ký");
  const [msgError, setMsgError] = useState("");
  const [msgSucess, setMsgSucess] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();


  const schema = yup.object({
    email: yup.string().required("Vui lòng nhập email"),
    last_name: yup.string().required("Vui lòng nhập họ"),
    first_name: yup.string().required("Vui lòng nhập tên"),
    phone_number: yup.string().required("Vui lòng nhập số điện thoại"),
    password: yup.string().required("Vui lòng nhập mật khẩu").min(4, "Mật khẩu có ít nhất 4 ký tự"),
    re_pass: yup.string().required("Vui lòng nhập lại mật khẩu").min(4, "Mật khẩu có ít nhất 4 ký tự").oneOf([yup.ref("password")], "Mật khẩu nhập lại không khớp"),
    street: yup.string().optional(),
    city: yup.string().optional(),
    state: yup.string().optional(),
    zip_code: yup.string().optional(),
  });

  type FormData = yup.InferType<typeof schema>;
  const { register, handleSubmit, reset, formState: { errors },} = useForm<FormData>({
    resolver: yupResolver(schema),
  })


  const checkEmailExists = async (email: string) => {
    const resCustomer = await fetch(`${SETTINGS.URL_API}/v1/customers`);
    const dataCustomer= await resCustomer.json();
    const listCustomer = dataCustomer.data.customers_list
    const existingUser = listCustomer.find((customer: TCustomer) => customer.email === email);

    if (existingUser) {
      return true; 
    }
    return false;
  };


  const onSubmit = async (data: FormData) => {
    setButtonText("Đang xử lý")
    setIsLoading(true)
    const customer =  { 
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone_number,
        password: data.password,
        street: data.street,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code
    }

    const emailExists = await checkEmailExists(customer.email);

    if (emailExists) {
      setMsgError('Email này đã được đăng ký!');
      setIsLoading(false);
      setButtonText('Đăng ký')
      return;
    }

    const resNewCustomer = await fetch(`${SETTINGS.URL_API}/v1/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    });

    const  dataNewCustomer =  await resNewCustomer.json()

    if (!resNewCustomer.ok) {
      setMsgError(dataNewCustomer.error || 'Đã có lỗi xảy ra!');
    } else {
      reset();
      setMsgError('');
      setIsLoading(false);
      setMsgSucess("Bạn đã đăng ký tài khoản thành công!")
      setTimeout(() => {
        router.push('/login');
      }, 3000); 
    }

  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Đăng ký</h2>
      <div className="pt-3"></div>
      <h4>Tạo tài khoản mới.</h4>
      <hr />
      {
        msgSucess && (
          <div
            className='bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-3'
            role='alert'
          >
            { msgSucess }
          </div>
        )
      }
      
      { msgError != '' &&  (
          <div
          className="text-danger validation-summary-valid"
          data-valmsg-summary="true"
        >
          { msgError }
        </div>
      )}
      
      <div className="form-group row">
        <label className="col-md-4 col-form-label" htmlFor="Email">
          Địa chỉ email
        </label>
        
        <div className="col-md-8">
          <input className="form-control" type="email" id="Email" {...register("email")} />
          <p className="text-red-500">{errors.email?.message}</p>
        </div>
      </div>
      <div className="form-group row">
        <label className="col-md-4 col-form-label" htmlFor="FullName">
          Họ
        </label>
       
        <div className="col-md-8">
          <input className="form-control" id="LastName" {...register("last_name")} />
          <p className="text-red-500 my-2">{errors.last_name?.message}</p>
        </div>
      </div>
      <div className="form-group row">
        <label className="col-md-4 col-form-label" htmlFor="FullName">
          Tên
        </label>
        
        <div className="col-md-8">
          <input className="form-control" id="Firstname" {...register("first_name")} />
          <p className="text-red-500 my-2">{errors.first_name?.message}</p>
        </div>
      </div>
      <div className="form-group row">
        <label className="col-md-4 col-form-label" htmlFor="PhoneNumber">
          Số điện thoại
        </label>
        
        <div className="col-md-8">
          <input className="form-control" id="PhoneNumber" {...register("phone_number")} />
          <p className="text-red-500 my-2">{errors.phone_number?.message}</p>
        </div>
      </div>
      <div className="form-group row">
        <label className="col-md-4 col-form-label" htmlFor="Password">
          Mật khẩu
        </label>
       
        <div className="col-md-8">
          <input className="form-control" type="password" id="Password" {...register("password")} />
          <p className="text-red-500 my-2">{errors.password?.message}</p>
        </div>
      </div>
      <div className="form-group row">
        <label className="col-md-4 col-form-label" htmlFor="ConfirmPassword">
          Xác nhận mật khẩu
        </label>
        
        <div className="col-md-8">
          <input
            className="form-control"
            type="password"
            id="ConfirmPassword"
            {...register("re_pass")}
          />
          <p className="text-red-500 my-2">{errors.re_pass?.message}</p>
        </div>
      </div>

      <div className="form-group row">
        <label className="col-md-4 col-form-label" htmlFor="Email">
          Đường
        </label>
        <div className="col-md-8">
          <input className="form-control" id="Street" {...register("street")}  />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-md-4 col-form-label">Thành Phố</label>
        <div className="col-md-8">
          <input className="form-control" {...register("city")} />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-md-4 col-form-label">Bang</label>
        <div className="col-md-8">
          <input className="form-control" {...register("state")} />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-md-4 col-form-label">Mã bưu chính</label>
        <div className="col-md-8">
          <input className="form-control" {...register("zip_code")} />
        </div>
      </div>

      <div className="form-group row">
        <div className="offset-md-4 col-md-8">
          <button className="btn btn-primary">{isLoading && <i className="fa fa-refresh mr-3 fa-spin" aria-hidden="true"></i>}{ buttonText }</button>
        </div>
      </div>
    </form>
  );
};

export default SignUp;
