import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message, Pagination, Select } from "antd";
const { Option } = Select;
import { axiosClient } from "../lib/axiosClient";
import { SETTINGS } from "../constants/settings";
import { Spin } from "antd";
import { useEffect, useRef, useState } from "react";

interface TProducts {
  _id?: string;
  product_name: string;
  price: number;
  discount: number;
  category: string;
  brand: string;
  description: string;
  thumbnail: string;
  stock: number;
  slug: string;
  order: number;
  isBest: boolean;
  isRecentlyAdded: boolean;
  isShowHome: boolean;
  isDelete: boolean;
  specifications: string;
}
interface TCategory {
  _id?: string;
  category_name: string;
}
interface TBrand {
  _id?: string;
  brand_name: string;
}

const ProductPage = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [params] = useSearchParams();
  const msg = params.get("msg");

  const messageShownRef = useRef(false);

  const page_str = params.get("page");
  const page = page_str ? parseInt(page_str) : 1;

  const category_str = params.get("category");
  const category_id = category_str ? category_str : null;

  const brand_str = params.get("brand");
  const brand_id = brand_str ? brand_str : null;

  const keyword_str = params.get("keyword");
  const keyword = keyword_str ? keyword_str : null;
  useEffect(() => {
    if (
      page === 1 &&
      !params.has("msg") &&
      !params.has("keyword") &&
      !params.has("category") &&
      !params.has("brand")
    )
      navigate("/product");
  }, [page, navigate, params]);
  const fetchProduct = async () => {
    const limit = 10;
    let url = `${SETTINGS.URL_API}/v1/products?`;

    if (category_id) {
      url += `category=${category_id}&`;
    }
    if (keyword) {
      url += `keyword=${keyword}&`;
    }

    if (brand_id) {
      url += `brand=${brand_id}&`;
    }

    url += `page=${page}&limit=${limit}`;

    const res = await axiosClient.get(url);
    return res.data.data;
  };
  const getAllProduct = useQuery({
    queryKey: ["products", page, category_id, brand_id, keyword],
    queryFn: fetchProduct,
  });
  const onFinishSearch = (values: {
    keyword?: string;
    category?: string;
    brand?: string;
  }) => {
    // console.log(values);
    const { keyword, category, brand } = values;

    const queryString = [
      keyword ? `keyword=${keyword.trim()}` : "",
      category ? `category=${category}` : "",
      brand ? `brand=${brand}` : "",
    ]
      .filter(Boolean)
      .join("&");

    navigate(`/product${queryString ? `?${queryString}` : ""}`);
  };

  //================== DELETE ==============//

  const queryClient = useQueryClient();

  const fetchDeleteProduct = async (id: string) => {
    const url = `${SETTINGS.URL_API}/v1/products/${id}`;
    const res = await axiosClient.delete(url);
    return res.data;
  };

  const deleteMutationProduct = useMutation({
    mutationFn: fetchDeleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", page],
      });
      messageApi.open({
        type: "success",
        content: "Xóa sản phẩm thành công",
      });
    },
    onError: (error) => {
      console.error("Lỗi khi xóa sản phẩm:", error);
      messageApi.open({
        type: "error",
        content: "Xóa sản phẩm thất bại",
      });
    },
  });
  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      deleteMutationProduct.mutate(id);
    }
  };
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [brands, setBrands] = useState<TBrand[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosClient.get(
          `${SETTINGS.URL_API}/v1/categories?page=1&limit=200`
        );
        // console.log("Dữ liệu danh mục:", res.data);
        setCategories(res.data.data.categories_list || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        setCategories([]);
      }
    };

    const fetchBrands = async () => {
      try {
        const res = await axiosClient.get(
          `${SETTINGS.URL_API}/v1/brands?page=1&limit=200`
        );
        // console.log("Dữ liệu thương hiệu:", res.data);
        setBrands(res.data.data.brands_list || []);
      } catch (error) {
        console.error("Lỗi khi lấy thương hiệu:", error);
        setBrands([]);
      }
    };

    fetchCategories();
    fetchBrands();
  }, []);
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
        <title>Electronics - Sản phẩm </title>
        <link rel="canonical" href={window.location.href} />
        <meta name="description" content="Sản phẩm" />
      </Helmet>
      <main className="h-full overflow-y-auto">
        <div className="container px-6 mx-auto grid">
          <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Sản phẩm
          </h2>
          <Link
            to="/product/add"
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
                <Input placeholder="Nhập tên sản phẩm" />
              </Form.Item>
              <Form.Item className="fr-search" name="category">
                <Select
                  className="w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                  placeholder="Chọn danh mục"
                  allowClear
                >
                  {categories.length > 0 ? (
                    categories.map((category: TCategory) => (
                      <Option key={category._id} value={category._id}>
                        {category.category_name}
                      </Option>
                    ))
                  ) : (
                    <Option value="">Danh mục không có...</Option>
                  )}
                </Select>
              </Form.Item>
              <Form.Item className="fr-search" name="brand">
                <Select
                  className="w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                  placeholder="Chọn thương hiệu"
                  allowClear
                >
                  {brands.length > 0 ? (
                    brands.map((brand: TBrand) => (
                      <Option key={brand._id} value={brand._id}>
                        {brand.brand_name}
                      </Option>
                    ))
                  ) : (
                    <Option value="">Thương hiệu không có...</Option>
                  )}
                </Select>
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
          {getAllProduct.isLoading ? (
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
                      <th className="px-4 py-3">Hình ảnh</th>
                      <th className="px-4 py-3">Tên sản phẩm</th>
                      <th className="px-4 py-3">Giá</th>
                      <th className="px-4 py-3">Danh mục</th>
                      <th className="px-4 py-3">Thương hiệu</th>
                      <th className="px-4 py-3">Sắp xếp</th>
                      <th className="px-4 py-3 ">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                    {getAllProduct.data?.products_list.length > 0 ? (
                      getAllProduct.data?.products_list.map(
                        (product: TProducts, i: number) => {
                          return (
                            <tr
                              key={i}
                              className="text-gray-700 dark:text-gray-400"
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center text-sm">
                                  <div className="relative hidden w-8 h-8  mr-3 rounded-full md:block">
                                    <div className="object-cover w-full h-full rounded-md flex items-center">
                                      <img
                                        loading="lazy"
                                        className="w-[40px] h-[40px] object-cover"
                                        src={`${SETTINGS.URL_IMAGE}/${product.thumbnail}`}
                                        alt={product.product_name}
                                      />
                                    </div>
                                    <div
                                      className="absolute inset-0 rounded-full shadow-inner"
                                      aria-hidden="true"
                                    ></div>
                                  </div>
                                  <div></div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {product.product_name}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {product.price != null
                                  ? product.price.toLocaleString("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    })
                                  : "Liên Hệ"}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {
                                  (
                                    product.category as {
                                      category_name?: string;
                                    }
                                  )?.category_name
                                }
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {
                                  (product.brand as { brand_name?: string })
                                    ?.brand_name
                                }
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {product.order}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center space-x-4 text-sm">
                                  <button
                                    onClick={() =>
                                      navigate(`/product/${product._id}`)
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
                                      handleDeleteProduct(product._id!)
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
                          {keyword != null ||
                          category_id != null ||
                          brand_id != null
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
                    {getAllProduct?.data?.pagination.totalRecords >
                      getAllProduct?.data?.pagination.limit && (
                      <Pagination
                        className="inline-flex items-center"
                        current={currentPage}
                        onChange={(page) => {
                          setCurrentPage(page);
                          navigate(`/product?page=${page}`);
                        }}
                        total={
                          getAllProduct?.data?.pagination.totalRecords || 0
                        }
                        pageSize={getAllProduct?.data?.pagination.limit || 10}
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

export default ProductPage;
