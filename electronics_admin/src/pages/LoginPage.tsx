import { Button, Form, FormProps } from "antd";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

type FieldType = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState<boolean>(true);

  // Neu login roi tra lai dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [navigate, isAuthenticated]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    // login api
    const result = await login(values.email, values.password);
    //Chuyển trang nếu login thành công
    if (result && result.isAuthenticated) {
      navigate("/");
    }
    if (!result.isAuthenticated) {
      setShowAlert(false);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = () => {
    //console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Electronics - Login </title>
        <link rel='canonical' href={window.location.href} />
        <meta name='description' content='Login' />
      </Helmet>

      <div className='flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900'>
        <div className='flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800'>
          <div className='flex flex-col overflow-y-auto md:flex-row'>
            <div className='h-32 md:h-auto md:w-1/2'>
              <img
                aria-hidden='true'
                className='object-cover w-full h-full dark:hidden'
                src='/images/login-office.jpeg'
                alt='Office'
              />
              <img
                aria-hidden='true'
                className='hidden object-cover w-full h-full dark:block'
                src='/images/login-office-dark.jpeg'
                alt='Office'
              />
            </div>
            <div className='flex items-center justify-center p-6 sm:p-12 md:w-1/2'>
              <div className='w-full'>
                <h1 className='mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200'>
                  Login
                </h1>
                {!showAlert && (
                  <div
                    className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-3'
                    role='alert'
                  >
                    <span className='font-bold'>Error:</span> Username or
                    password is invalid.
                  </div>
                )}

                <Form
                  name='basic'
                  wrapperCol={{ span: 24 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete='off'
                >
                  <Form.Item<FieldType>
                    name='email'
                    rules={[
                      { required: true, message: "Please input your email!" },
                    ]}
                  >
                    <label className='block text-sm'>
                      <span className='text-gray-700 dark:text-gray-400'>
                        Email
                      </span>
                      <input
                        className='pl-3 block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                        placeholder='example@gmail.com'
                      />
                    </label>
                  </Form.Item>

                  <Form.Item<FieldType>
                    name='password'
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                  >
                    <label className='block mt-4 text-sm'>
                      <span className='text-gray-700 dark:text-gray-400'>
                        Password
                      </span>
                      <input
                        className='pl-3 block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input'
                        placeholder='***************'
                        type='password'
                      />
                    </label>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      className='pb-[28px] block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple'
                      type='primary'
                      htmlType='submit'
                    >
                      Login
                    </Button>
                  </Form.Item>
                </Form>

                {/* <p className="mt-4">
                <a
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  href="./forgot-password.html"
                >
                  Forgot your password?
                </a>
              </p>
              <p className="mt-1">
                <a
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  href="./create-account.html"
                >
                  Create account
                </a>
              </p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
