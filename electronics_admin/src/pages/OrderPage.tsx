import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message, Pagination } from "antd";
import { axiosClient } from "../lib/axiosClient";
import { SETTINGS } from "../constants/settings";
import { Spin } from "antd";
import { useEffect, useRef, useState } from "react";

interface TOrder {
  _id: string;
  customer: string;
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
    }
  ];
  street: string;
  city: string;
  state: string;
  zip_code?: string;
  payment_type: number;
  order_note?: string;
}
// const formatDate = (dateString: string | Date) => {
//   const date = new Date(dateString);
//   return date.toLocaleString('vi-VN', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit'
//   });
// };
const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  const dateStr = date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dateStr} ${timeStr}`;
};

const OrderPage = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [params] = useSearchParams();
  const msg = params.get("msg");

  const messageShownRef = useRef(false);

  const page_str = params.get("page");
  const page = page_str ? parseInt(page_str) : 1;

  const keyword_str = params.get("keyword");
  const keyword = keyword_str ? keyword_str : null;
  useEffect(() => {
    if (page === 1 && !params.has("msg") && !params.has("keyword"))
      navigate("/order");
  }, [page, navigate, params]);

  const fetchOrder = async () => {
    const limit = 10;
    let url = `${SETTINGS.URL_API}/v1/orders?`;
    if (keyword) {
      url += `keyword=${keyword}&`;
    }

    url += `page=${page}&limit=${limit}`;

    const res = await axiosClient.get(url);
    return res.data.data;
  };
  const getAllOrder = useQuery({
    queryKey: ["orders", page, keyword],
    queryFn: fetchOrder,
  });
  // console.log("Pagination data:", {
  //   total: getAllOrder?.data?.pagination?.totalRecords,
  //   limit: getAllOrder?.data?.pagination?.limit,
  // });

  const onFinishSearch = (values: { keyword?: string; phone?: string }) => {
    // console.log(values);
    const { keyword, phone } = values;

    const queryString = [
      keyword ? `keyword=${keyword.trim()}` : "",
      phone ? `phone=${phone.trim()}` : "",
    ]
      .filter(Boolean)
      .join("&");

    navigate(`/order${queryString ? `?${queryString}` : ""}`);
  };

  //================== DELETE ==============//

  const queryClient = useQueryClient();

  const fetchDeleteOrder = async (id: string) => {
    const url = `${SETTINGS.URL_API}/v1/orders/${id}`;
    const res = await axiosClient.delete(url);
    return res.data;
  };

  const deleteMutationOrder = useMutation({
    mutationFn: fetchDeleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders", page],
      });
      messageApi.open({
        type: "success",
        content: "Xóa đơn hàng thành công",
      });
    },
    onError: (error) => {
      console.error("Lỗi khi xóa đơn hàng:", error);
      messageApi.open({
        type: "error",
        content: "Xóa đơn hàng thất bại",
      });
    },
  });
  const handleDeleteOrder = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này không?")) {
      deleteMutationOrder.mutate(id);
    }
  };

  useEffect(() => {
    if (msg && !messageShownRef.current) {
      const messageContent = {
        success: "Thêm mới thành công",
        update_success: "Cập nhật thành công",
      }[msg];

      if (messageContent) {
        // Hiển thị thông báo thành công
        messageApi.success(messageContent);
        messageShownRef.current = true;
      }
    }
  }, [msg, messageApi]);
  // Khởi tạo state cho trang hiện tại
  const [currentPage, setCurrentPage] = useState(page);
  useEffect(() => {
    // Cập nhật currentPage khi giá trị của 'page' thay đổi trong URL
    setCurrentPage(page);
  }, [page, params]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Electronics - Đơn hàng </title>
        <link rel="canonical" href={window.location.href} />
        <meta name="description" content="Sản phẩm" />
      </Helmet>
      <main className="h-full overflow-y-auto">
        <div className="container px-6 mx-auto grid">
          <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Đơn hàng
          </h2>
          <Link
            to="/order/add"
            className="w-[120px] my-3 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
          >
            Thêm mới <span className="ml-2">+</span>
          </Link>
          <Form
            form={form}
            name="form-search"
            onFinish={onFinishSearch}
            autoComplete="off"
            layout="vertical"
            className="frm-search"
          >
            <div className="grid gid-cols-12 md:grid-cols-4 gap-[15px]">
              <Form.Item name="keyword">
                <Input placeholder="Nhập tên khách hàng" />
              </Form.Item>
              <Form.Item name="phone">
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
              <Form.Item>
                <Button
                  className="w-[120px] my-3 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                  type="primary"
                  htmlType="submit"
                >
                  Lọc
                </Button>
              </Form.Item>
            </div>
          </Form>
          {contextHolder}
          {getAllOrder.isLoading ? (
            <div className="w-full mb-8 overflow-hidden rounded-lg shadow-xs text-center">
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
              />
            </div>
          ) : (
            <div className="w-full mb-8 overflow-hidden rounded-lg shadow-xs">
              <div className="w-full overflow-x-auto">
                <table className="w-full whitespace-no-wrap">
                  <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                      <th className="px-4 py-3">Khách hàng </th>
                      <th className="px-4 py-3">Số điện thoại </th>
                      <th className="px-4 py-3">Giá</th>
                      <th className="px-4 py-3">Trạng thái</th>
                      <th className="px-4 py-3">Ngày Đặt hàng</th>
                      <th className="px-4 py-3">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                    {getAllOrder.data?.orders_list.length > 0 ? (
                      getAllOrder.data?.orders_list.map(
                        (order: TOrder, i: number) => {
                          return (
                            <tr
                              key={i}
                              className="text-gray-700 dark:text-gray-400"
                            >
                              <td className="px-4 py-3">
                                <div className="font-semibold">
                                  {
                                    (
                                      order.customer as {
                                        first_name?: string;
                                      }
                                    )?.first_name
                                  }
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {(order.customer as { phone?: number })?.phone}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {
                                  order.order_items.map(
                                    (item) => item.price_end
                                  )
                                  //  order.order_items.reduce((sum, item) => sum + item.price, 0)
                                }
                              </td>
                              <td className="px-4 py-3 text-xs">
                                <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                                  {order.orderStatusTitle}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {formatDate(order.order_date)}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex items-center space-x-4 text-sm">
                                  <button
                                    onClick={() =>
                                      navigate(`/order/${order._id}`)
                                    }
                                    className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                                    aria-label="Edit"
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      aria-hidden="true"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteOrder(order._id!)
                                    }
                                    className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                                    aria-label="Delete"
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      aria-hidden="true"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )
                    ) : (
                      <tr className="text-gray-700 dark:text-gray-400">
                        <td colSpan={7} className="text-center py-3">
                          {keyword != null
                            ? "Không tìm thấy"
                            : "Dữ liệu đang được cập nhật"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
                <span className="flex col-span-9 mt-2 sm:mt-auto sm:justify-end">
                  <nav aria-label="Table navigation">
                    {getAllOrder?.data?.pagination.totalRecords >
                      getAllOrder?.data?.pagination.limit && (
                      <Pagination
                        className="inline-flex items-center"
                        current={currentPage}
                        onChange={(page) => {
                          setCurrentPage(page);
                          navigate(`/order?page=${page}`);
                        }}
                        total={getAllOrder?.data?.pagination.totalRecords || 0}
                        pageSize={getAllOrder?.data?.pagination.limit || 10}
                      />
                    )}
                  </nav>
                  {/* <nav aria-label="Table navigation">
                    {getAllOrder?.data?.pagination && ( // Kiểm tra pagination tồn tại
                      <Pagination
                        className="inline-flex items-center"
                        current={currentPage}
                        total={getAllOrder.data.pagination.totalRecords}
                        pageSize={getAllOrder.data.pagination.limit}
                        onChange={(page) => {
                          setCurrentPage(page);
                          navigate(`/order?page=${page}`);
                        }}
                      />
                    )}
                  </nav> */}
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};
export default OrderPage;
