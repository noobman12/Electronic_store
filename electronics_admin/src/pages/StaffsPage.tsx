import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SETTINGS } from "../constants/settings";
import { axiosClient } from "../lib/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Button, Form, Input, message, Pagination, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { FaLock } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

interface TStaff {
  _id: string;
  avatar?: string;
  first_name: string;
  last_name: string;
  fullname: string;
  phone: string;
  email: string;
  password: string;
  active?: boolean;
  role?: number;
}
interface TFilter {
  keyword: string;
  email: string;
  phone: string;
}

const StaffsPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user } = useAuth();

  const [formSearch] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const page_str = params.get("page");
  const page = page_str ? parseInt(page_str) : 1;
  const limit = 10;
  const keyword = params.get("keyword");
  const name = keyword ? keyword : null;
  const email_staff = params.get("email");
  const email = email_staff ? email_staff : null;
  const phone_staff = params.get("phone");
  const phone = phone_staff ? phone_staff : null;
  const msg = params.get("msg");

  const hasShownMessageRef = useRef(false);
  useEffect(() => {
    if (msg && msg !== null && !hasShownMessageRef.current) {
      messageApi.open({
        type: "success",
        content: "Thêm thành viên thành công!",
      });
      hasShownMessageRef.current = true;
    }
  }, [msg, messageApi]);

  useEffect(() => {
    if (
      page === 1 &&
      !params.has("msg") &&
      !params.has("keyword") &&
      !params.has("phone") &&
      !params.has("email")
    )
      navigate("/staffs");
  }, [page, navigate, params]);

  const fetchStaffs = async () => {
    let url = `${SETTINGS.URL_API}/v1/staffs?`;
    if (name) {
      url += `keyword=${name}&`;
    }
    if (email) {
      url += `email=${email}&`;
    }
    if (phone) {
      url += `phone=${phone}&`;
    }
    url += `page=${page}&limit=${limit}`;
    const response = await axiosClient.get(url);
    return response.data.data;
  };
  const getAllStaffs = useQuery({
    queryKey: ["staffs", page, name, email, phone],
    queryFn: fetchStaffs,
  });

  const queryClient = useQueryClient();
  const fetchDeleleStaff = async (id: string) => {
    const url = `${SETTINGS.URL_API}/v1/staffs/${id}`;
    const res = await axiosClient.delete(url);
    return res.data.data;
  };
  const deleteStaff = useMutation({
    mutationFn: fetchDeleleStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["staffs", page, name, email, phone],
      });

      messageApi.open({
        type: "success",
        content: "Xóa thành viên thành công!",
      });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Có lỗi trong quá trình xóa!",
      });
    },
  });

  const handleDelete = (itemId: string) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa không?");
    if (confirmed) {
      deleteStaff.mutate(itemId);
    }
  };

  const onFinishSearch = async (values: TFilter) => {
    const { keyword, email, phone } = values;

    const queryString = [
      keyword ? `keyword=${keyword.trim()}` : "",
      email ? `email=${email.trim()}` : "",
      phone ? `phone=${phone.trim()}` : "",
    ]
      .filter(Boolean)
      .join("&");

    navigate(`/staffs${queryString ? `?${queryString}` : ""}`);
  };
  const onFinishFailedSearch = async (errorInfo: unknown) => {
    console.log("ErrorInfo", errorInfo);
  };

  useEffect(() => {
    if (user?.role != 1) {
      navigate("/");
    }
  }, [navigate, user]);

  useEffect(() => {
    if (user?.role != 1) {
      navigate("/");
    }
  }, [navigate, user]);

  const [currentPage, setCurrentPage] = useState(page);
  useEffect(() => {
    setCurrentPage(page);
  }, [page, params]);

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Electronics - Nhân viên </title>
        <link rel='canonical' href={window.location.href} />
        <meta name='description' content='Nhân viên' />
      </Helmet>
      {contextHolder}
      <main className='h-full overflow-y-auto'>
        <div className='container px-6 mx-auto grid'>
          <h2 className='my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200'>
            Nhân viên
          </h2>
          <Link
            to='/staff/add'
            className='w-[120px] my-3 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple'
          >
            Thêm mới <span className='ml-2'>+</span>
          </Link>

          {getAllStaffs.isLoading ? (
            <div className='w-full mb-8 overflow-hidden rounded-lg shadow-xs text-center'>
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
              />
            </div>
          ) : (
            <div className='w-full mb-8 overflow-hidden rounded-lg shadow-xs'>
              <div className='w-full overflow-x-auto'>
                <Form
                  form={formSearch}
                  name='form-search'
                  onFinish={onFinishSearch}
                  onFinishFailed={onFinishFailedSearch}
                  autoComplete='on'
                  layout='vertical'
                >
                  <div className='grid gid-cols-12 md:grid-cols-4 gap-[15px]'>
                    <Form.Item name='keyword'>
                      <Input placeholder='Nhập tên' />
                    </Form.Item>
                    <Form.Item name='email'>
                      <Input placeholder='Nhập email' />
                    </Form.Item>
                    <Form.Item name='phone'>
                      <Input placeholder='Nhập số điện thoại' />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        className='w-[120px] my-3 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple'
                        type='primary'
                        htmlType='submit'
                      >
                        Lọc
                      </Button>
                    </Form.Item>
                  </div>
                </Form>
                <table className='w-full whitespace-no-wrap'>
                  <thead>
                    <tr className='text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800'>
                      <th className='px-4 py-3'>Hình ảnh</th>
                      <th className='px-4 py-3'>Họ tên</th>
                      <th className='px-4 py-3'>Email</th>
                      <th className='px-4 py-3'>Số điện thoại</th>
                      <th className='px-4 py-3'>Vai trò</th>
                      <th className='px-4 py-3 text-center'>Trạng thái</th>
                      <th className='px-4 py-3'>Hành động</th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y dark:divide-gray-700 dark:bg-gray-800'>
                    {getAllStaffs?.data?.staffs_list.length > 0 ? (
                      getAllStaffs?.data?.staffs_list.map(
                        (item: TStaff, i: number) => {
                          return (
                            <tr
                              key={i}
                              className='text-gray-700 dark:text-gray-400'
                            >
                              <td className='px-4 py-3'>
                                {item.avatar && item.avatar !== null ? (
                                  <img
                                    className='w-[40px] h-[40px] rounded-full object-cover'
                                    src={`${SETTINGS.URL_IMAGE}/${item.avatar}`}
                                    alt={item.fullname}
                                  />
                                ) : (
                                  <img
                                    className='w-[40px] h-[40px] rounded-full object-cover'
                                    src='/images/noavatar.png'
                                    alt={item.fullname}
                                  />
                                )}
                              </td>
                              <td className='px-4 py-3 text-sm'>
                                {item.fullname}
                              </td>
                              <td className='px-4 py-3 text-xs'>
                                {item.email}
                              </td>
                              <td className='px-4 py-3 text-xs'>
                                {item.phone}
                              </td>
                              <td className='px-4 py-3 text-sm'>
                                {item.role === 1
                                  ? "Quản trị viên"
                                  : "Thành viên"}
                              </td>
                              <td className='px-4 py-3 text-sm '>
                                {item.active ? (
                                  <FaLock
                                    className='text-green-500 cursor-pointer m-auto'
                                    title='Đang kích hoạt'
                                  />
                                ) : (
                                  <FaLock
                                    className='text-red-500 cursor-pointer m-auto'
                                    title='Tài khoản bị khóa'
                                  />
                                )}
                              </td>
                              <td className='px-4 py-3'>
                                <div className='flex items-center space-x-4 text-sm'>
                                  <button
                                    onClick={() => {
                                      navigate(`/staff/${item._id}`);
                                    }}
                                    className='flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray'
                                    aria-label='Edit'
                                  >
                                    <svg
                                      className='w-5 h-5'
                                      aria-hidden='true'
                                      fill='currentColor'
                                      viewBox='0 0 20 20'
                                    >
                                      <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z'></path>
                                    </svg>
                                  </button>
                                  {user?._id !== item._id && (
                                    <button
                                      onClick={() => {
                                        handleDelete(item._id);
                                      }}
                                      className='flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray'
                                      aria-label='Delete'
                                    >
                                      <svg
                                        className='w-5 h-5'
                                        aria-hidden='true'
                                        fill='currentColor'
                                        viewBox='0 0 20 20'
                                      >
                                        <path
                                          fillRule='evenodd'
                                          d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                                          clipRule='evenodd'
                                        ></path>
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )
                    ) : (
                      <tr className='text-gray-700 dark:text-gray-400'>
                        <td colSpan={7} className='text-center py-3'>
                          {keyword != null || email != null || phone != null
                            ? "Không tìm thấy"
                            : "Dữ liệu đang được cập nhật"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className='grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800'>
                <span className='flex col-span-12 mt-2 m-auto'>
                  <nav aria-label='Table navigation'>
                    {getAllStaffs?.data?.pagination.totalRecords >
                      getAllStaffs?.data?.pagination.limit && (
                      <Pagination
                        className='inline-flex items-center'
                        current={currentPage}
                        onChange={(page) => {
                          setCurrentPage(page);
                          navigate(`/staffs?page=${page}`);
                        }}
                        total={getAllStaffs?.data?.pagination.totalRecords || 0}
                        pageSize={getAllStaffs?.data?.pagination.limit || 10}
                      />
                    )}
                  </nav>
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default StaffsPage;
