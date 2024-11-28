import { Helmet } from "react-helmet-async";
import { Form, message, Select } from "antd";
const { Option } = Select;
import { useParams } from "react-router-dom";
import { SETTINGS } from "../constants/settings";
import { axiosClient } from "../lib/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
interface TOrder {
  _id: string;
  customer: {
    _id: string;
    first_name: string;
    phone: string;
  };
  staff: string;
  order_date: Date;
  order_status: number;
  orderStatusTitle: string;
  order_items: [
    {
      _id: string;
      product_name: string;
      quantity: number;
      price: number;
      discount: number;
      price_end: number;
      thumbnail?: string;
      orderStatusTitle: string;
      paymentTypeTitle: string;
    }
  ];
  street: string;
  city: string;
  state: string;
  zip_code?: string;
  payment_type: number;
  order_note?: string;
}
interface TStaff {
  _id: string;
  first_name: string;
  last_name: string;
  fullname: string;
  active?: boolean;
  role?: number;
}

const OrderEdit = () => {
  const [formUpdate] = Form.useForm();
  const { user } = useAuth();
  const { id } = useParams();

  const fetchOrderById = async (id: string) => {
    const url = `${SETTINGS.URL_API}/v1/orders/${id}`;
    const res = await axiosClient.get(url);
    return res.data.data;
  };

  const getOrderById = useQuery({
    queryKey: ["orders", id],
    queryFn: () => fetchOrderById(id!),
    enabled: !!id,
  });

  const fetchStaffs = async () => {
    let url = `${SETTINGS.URL_API}/v1/staffs?`;

    const response = await axiosClient.get(url);
    return response.data.data;
  };
  const getAllStaffs = useQuery({
    queryKey: ["staffs"],
    queryFn: fetchStaffs,
  });
  useEffect(() => {
    if (getOrderById.data) {
      formUpdate.setFieldsValue({
        ...getOrderById.data,
        order_status: String(getOrderById.data.order_status),
        staff: getOrderById.data?.staff?._id,
      });
    }
  }, [getOrderById.data, formUpdate]);

  const [messageApi, contextHolder] = message.useMessage();

  const fetchUpdateOrder = async (payload: TOrder) => {
    const url = `${SETTINGS.URL_API}/v1/orders/${id}`;
    const resUpdate = await axiosClient.put(url, payload);
    return resUpdate.data.data;
  };
  const queryClient = useQueryClient();
  const updateMutationCustomer = useMutation({
    mutationFn: fetchUpdateOrder,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customer", id],
      });
      messageApi.open({
        type: "success",
        content: "Cập nhật đơn hàng thành công!",
      });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Cập nhật đơn hàng lỗi!",
      });
    },
  });

  const onFinishUpdate = async (values: TOrder) => {
    const info_customer = { ...values };
    updateMutationCustomer.mutate(info_customer);
  };
  const onFinishFailedUpdate = async (errorInfo: unknown) => {
    console.log("ErrorInfo", errorInfo);
  };
  const total = getOrderById.data?.order_items?.reduce(
    (sum: number, item: { price_end: number; quantity: number }) => {
      return sum + item.price_end * item.quantity;
    },
    0
  );
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Electronics - Sửa đơn hàng </title>
        <link rel="canonical" href={window.location.href} />
        <meta name="description" content="Sửa đơn hàng" />
      </Helmet>
      {contextHolder}
      <main className="h-full overflow-y-auto">
        <div className="container px-6 mx-auto grid">
          <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Chỉnh sửa đơn hàng
          </h2>
          <div className="grid grid-cols-12 md:grid-cols-12 gap-[15px]">
            <div className="col-span-12">
              <h3 className=" mt-4 mb-3 text-1xl text-gray-700 dark:text-gray-200">
                Thông tin khách hàng
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-[15px]">
                <li className=" text-base text-gray-700 dark:text-gray-400">
                  Tên Khách hàng:
                  <span className="ml-2 text-base text-gray-700 dark:text-gray-200">
                    {getOrderById.data?.customer?.first_name}
                  </span>
                </li>
                <li className=" text-base text-gray-700 dark:text-gray-400">
                  Số điện thoại:
                  <span className=" ml-2 text-base text-gray-700 dark:text-gray-200">
                    {getOrderById.data?.customer?.phone}
                  </span>
                </li>
                <li className="   text-base text-gray-700 dark:text-gray-400">
                  Email:
                  <span className=" ml-2 text-base text-gray-700 dark:text-gray-200">
                    {getOrderById.data?.customer?.email}
                  </span>
                </li>
                <li className=" text-base text-gray-700 dark:text-gray-400">
                  Địa chỉ:
                  <span className=" ml-2 text-base text-gray-700 dark:text-gray-200">
                    {getOrderById.data?.customer?.street},
                    {getOrderById.data?.customer?.city},
                    {getOrderById.data?.customer?.state}
                  </span>
                </li>
              </ul>
              <h3 className="mt-[15px] mb-3 text-1xl text-gray-700 dark:text-gray-200">
                Thông tin đơn hàng:
              </h3>
              <div className="overflow-x-auto">
                <table className="border w-full">
                  <thead className="border">
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                      <th className="px-4 py-3 border-2 border-solid">
                        Tên sản phẩm
                      </th>
                      <th className="px-4 py-3 border-2 border-solid text-center">
                        Giá
                      </th>
                      <th className="px-4 py-3 border-2 border-solid text-center">
                        Số lượng
                      </th>
                      <th className="px-4 py-3 border-2 border-solid text-center">
                        Thành tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getOrderById.data?.order_items?.map((item: any) => (
                      <tr
                        key={item._id}
                        className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
                      >
                        <th className="px-4 py-3 border-2 border-solid">
                          {item.product_name}
                        </th>
                        <th className="px-4 py-3 border-2 border-solid text-center">
                          {item.price_end}
                        </th>
                        <th className="px-4 py-3 border-2 border-solid text-center">
                          {item.quantity}
                        </th>
                        <th className="px-4 py-3 border-2 border-solid text-center">
                          <strong>
                            {(item.price_end * item.quantity).toLocaleString(
                              "vi-VN"
                            )}{" "}
                            VNĐ
                          </strong>
                        </th>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                    <tr className="border-2">
                      <td className="px-4 py-3" colSpan={3}>
                        <strong>Phương Thức Thanh Toán:</strong>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <strong>{getOrderById.data?.paymentTypeTitle}</strong>
                      </td>
                    </tr>
                    <tr className="border-2">
                      <td className="px-4 py-3" colSpan={3}>
                        <strong>Tổng số tiền:</strong>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <strong>{total?.toLocaleString("vi-VN")} VNĐ</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <Form
                form={formUpdate}
                name="form-update"
                onFinish={onFinishUpdate}
                onFinishFailed={onFinishFailedUpdate}
                autoComplete="off"
              >
                <div className="flex flex-wrap mt-5 ml-[-0.75rem] mr-[-0.75rem]">
                  <div className="form-group w-full sm:w-1/3">
                    <Form.Item name="order_status" className="px-3">
                      <Select
                        className="w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                        placeholder="Chọn Trạng thái"
                        allowClear
                      >
                        <Option value="1">Pending</Option>
                        <Option value="2">Processing</Option>
                        <Option value="3">Rejected</Option>
                        <Option value="4">Completed</Option>
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="form-group  w-full sm:w-1/3">
                    <Form.Item name="staff" className="px-3">
                      {user?.role === 1 ? (
                        // Quản trị viên: Hiển thị danh sách thành viên và có thể chỉnh sửa
                        <Select
                          className="w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                          placeholder="Chọn Thành viên"
                          allowClear
                          options={getAllStaffs.data?.staffs_list.map(
                            (staff: TStaff) => ({
                              value: staff._id,
                              label: staff.fullname,
                            })
                          )}
                        />
                      ) : (
                        // Thành viên: Chỉ hiển thị tên của chính họ, không thể chỉnh sửa
                        getOrderById.data?.staff === null ? (
                          <Select
                            className="w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none"
                            
                            value={user?._id} // Hiển thị giá trị là ID của user đang đăng nhập
                            options={[
                              {
                                value: user?._id, // Giá trị của user hiện tại
                                label: user?.fullname, // Hiển thị tên đầy đủ của user
                              },
                            ]}
                          />
                        ) : (
                          <Select
                            className="w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none"
                            disabled
                            //value={user?._id} // Hiển thị giá trị là ID của user đang đăng nhập
                            options={getAllStaffs.data?.staffs_list.map(
                              (staff: TStaff) => ({
                                value: staff._id,
                                label: staff.fullname,
                              })
                            )}
                          />
                        )
                      )}
                    </Form.Item>
                    
                    
                  </div>
                  <div className="form-group w-full sm:w-1/3 ">
                    <Form.Item className="px-3">
                      <button
                        type="submit"
                        className="h-[41px] w-full mx-auto block mt-1 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                      >
                        Cập nhật
                      </button>
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default OrderEdit;
