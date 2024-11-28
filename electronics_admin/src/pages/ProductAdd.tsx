import { Helmet } from "react-helmet-async";
import { axiosClient } from "../lib/axiosClient";
import { SETTINGS } from "../constants/settings";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { buildSlug } from "../helpers/buildSlug";
import axios from "axios";
import { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
interface TCategory {
  _id?: string;
  category_name: string;
}
interface TBrand {
  _id?: string;
  brand_name: string;
}
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
  specifications: string;
}
const ProductAdd = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [editorData, setEditorData] = useState("");


  /* ============= THEM MOI ================ */
  const fetchCreateProduct = async (payload: TProducts) => {
    const url = `${SETTINGS.URL_API}/v1/products/`;
    const res = await axiosClient.post(url, payload);
    return res.data;
  };
  const createMutationProduct = useMutation({
    mutationFn: fetchCreateProduct,
    onSuccess: () => {
      //Hiển thị một message thông báo là Thêm thành công
      form.resetFields();
      navigate(`/product?msg=success`);
    },
    onError: (error) => {
      console.log("Lỗi khi thêm sản phẩm:", error);
      messageApi.open({
        type: "error",
        // content: `Thêm mới lỗi: ${error.message || "Có lỗi xảy ra"}`,
        content: `Thêm mới lỗi`,
      });
    },
  });
  const onFinish = async (values: TProducts) => {
    // khi họ nhập đường dẫn không đúng định dạng thì ép kiểu nó thành slug
    if (values.slug !== undefined) {
      values.slug = buildSlug(values.slug);
    }
    if (fileList.length === 0) {
      message.error("Vui lòng chọn file trước khi tải lên.");
      // createMutationProduct.mutate(values);
    } else {
      const resulUpload = await handleUpload(fileList[0]);
      if (resulUpload !== null) {
        const info_product = { ...values, thumbnail: resulUpload ,  description: editorData};
        // Gọi api để thêm sản phẩm
        createMutationProduct.mutate(info_product);
      }
    }
  };
  const uploadProps: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([file]); // Chỉ chọn một file, nếu cần nhiều file thì sử dụng `setFileList([...fileList, file])`
      return false; // Tắt upload tự động
    },
    fileList,
  };

  /* ============= GET CATEGORIES, BRANDS ================ */
  const fetchCategories = async () => {
    const url = `${SETTINGS.URL_API}/v1/categories?page=1&limit=200`;
    const res = await axiosClient.get(url);
    return res.data.data;
  };
  const queryCategories = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Get brands
  const fetchBrands = async () => {
    const url = `${SETTINGS.URL_API}/v1/brands?page=1&limit=200`;
    const res = await axiosClient.get(url);
    return res.data.data;
  };

  const queryBrands = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
  });

  // handle upload việc upload ảnh
  const handleUpload = async (file: UploadFile) => {
    const formData = new FormData();
    formData.append("file", file as unknown as File);
    try {
      const response = await axiosClient.post(
        `${SETTINGS.URL_API}/v1/upload/single-handle`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.statusCode === 200) {
        return response.data.data.link;
      } else {
        return null;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.data.statusCode;
        if (statusCode === 400) {
          messageApi.open({
            type: "error",
            content: "Dung lượng ảnh không lớn hơn 2MB",
          });
        } else {
          messageApi.open({
            type: "error",
            content:
              "Chỉ dược upload hình .png, .gif, .jpg, webp, and .jpeg format allowed!",
          });
        }
        return null;
      } else {
        console.log("Unexpected error:", error);
        return null;
      }
    }
  };

  return (
    <>
      {contextHolder}
      <Helmet>
        <meta charSet='utf-8' />
        <title>Electronics - Thêm mới sản phẩm </title>
        <link rel='canonical' href={window.location.href} />
        <meta name='description' content='Thêm mới sản phẩm' />
      </Helmet>

      <main className='h-full overflow-y-auto'>
        <div className='container px-6 mx-auto grid'>
          <h2 className='my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200'>
            Thêm mới Sản Phẩm
          </h2>
          <div className='grid grid-cols-12 md:grid-cols-12 gap-[15px]'>
            <div className='col-span-12'>
              <Form form={form} onFinish={onFinish} layout='vertical'>
                <div className='flex'>
                  <div className='form-group w-1/2 pr-2'>
                    <label className='block mt-4 text-sm'>
                      <span className='text-gray-700 dark:text-gray-400'>
                        Tên Sản Phẩm
                      </span>
                      <Form.Item
                        name='product_name'
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên sản phẩm",
                          },
                        ]}
                      >
                        <Input className=' pl-3 block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input' />
                      </Form.Item>
                    </label>
                  </div>
                  <div className='form-group w-1/2 pl-2'>
                    <label className='block mt-4 text-sm'>
                      <span className='text-gray-700 dark:text-gray-400'>
                        Đường dẫn
                      </span>

                      <Form.Item name='slug'>
                        <Input className='pl-3 block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input' />
                      </Form.Item>
                    </label>
                  </div>
                </div>

                <div className='form-group'>
                  <div className='flex'>
                    <div className='form-group w-1/2 pr-2'>
                      <label className='block mt-4 text-sm'>
                        <span className='text-gray-700 dark:text-gray-400'>
                          Giá
                        </span>
                        <Form.Item name='price'>
                          <Input
                            type='number'
                            min='0'
                            className='pl-3 block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input'
                          />
                        </Form.Item>
                      </label>
                    </div>
                    <div className='form-group w-1/2 pl-2'>
                      <label className='block mt-4 text-sm'>
                        <span className='text-gray-700 dark:text-gray-400'>
                          Discount
                        </span>
                        <Form.Item name='discount'>
                          <Input
                            type='number'
                            min='0'
                            className='pl-3 block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input'
                          />
                        </Form.Item>
                      </label>
                    </div>
                  </div>
                </div>
                <div className='flex'>
                  <div className='form-group w-1/2 pr-2'>
                    <label className='block mt-4 text-sm'>
                      <span className='text-gray-700 dark:text-gray-400'>
                        Danh mục sản phẩm
                      </span>
                      <Form.Item
                        className='mg-top'
                        name='category'
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn danh mục",
                          },
                        ]}
                      >
                        <Select
                          className='w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray'
                          placeholder='Chọn danh mục'
                          options={queryCategories.data?.categories_list.map(
                            (category: TCategory) => ({
                              value: category._id,
                              label: category.category_name,
                            })
                          )}
                        />
                      </Form.Item>
                    </label>
                  </div>
                  <div className='form-group w-1/2 pl-2'>
                    <label className='block mt-4 text-sm'>
                      <span className='text-gray-700 dark:text-gray-400'>
                        Thương hiệu
                      </span>
                      <Form.Item
                        className='mg-top'
                        name='brand'
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn thương hiệu",
                          },
                        ]}
                      >
                        <Select
                          className='w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray'
                          placeholder='Chọn thương hiệu'
                          options={queryBrands.data?.brands_list.map(
                            (brand: TBrand) => ({
                              value: brand._id,
                              label: brand.brand_name,
                            })
                          )}
                        />
                      </Form.Item>
                    </label>
                  </div>
                </div>
                <div className='flex'>
                  <div className='form-group w-1/2 pr-2'>
                    <label className='block mt-4 text-sm'>
                      <span className='text-gray-700 dark:text-gray-400'>
                        Tồn kho
                      </span>
                      <Form.Item name='stock'>
                        <Input
                          type='number'
                          min='0'
                          className='pl-3 block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input'
                        />
                      </Form.Item>
                    </label>
                  </div>
                  <div className='form-group w-1/2 pl-2'>
                    <label className='block mt-4 text-sm'>
                      <span className='text-gray-700 dark:text-gray-400'>
                        Sắp xếp
                      </span>

                      <Form.Item name='order'>
                        <Input
                          type='number'
                          min='0'
                          className='pl-3 block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input'
                        />
                      </Form.Item>
                    </label>
                  </div>
                </div>
                <div className='form-group'>
                  <label className='block mt-4 text-sm'>
                    <span className='text-gray-700 dark:text-gray-400'>
                      Thông số kỹ thuật
                    </span>
                    <Form.Item
                      name='specifications'
                      className='pl-3 block w-full mt-1 text-sm dark:text-gray-300 dark:bg-gray-700 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input'
                    >
                      <Input.TextArea
                        rows={5}
                        className='pl-3 block w-full mt-1 text-sm dark:text-gray-300 dark:bg-gray-700 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input'
                        style={{
                          border: "none",
                          outline: "none",
                          boxShadow: "none",
                          padding: 0,
                        }}
                      />
                    </Form.Item>
                  </label>
                </div>
                <div className='form-group'>
                  <label className='block mt-4 text-sm'>
                    <span className='text-gray-700 dark:text-gray-400'>
                      Chi tiết sản phẩm
                    </span>
                    <Form.Item
                      className='pl-3 block w-full mt-1 text-sm dark:text-gray-300 dark:bg-gray-700 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input'
                      name='description'
                    >
                      {/* <Input.TextArea
                        rows={5}
                        className='pl-3 block w-full mt-1 text-sm dark:text-gray-300 dark:bg-gray-700 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input'
                        style={{
                          border: "none",
                          outline: "none",
                          boxShadow: "none",
                          padding: 0,
                        }}
                      /> */}
                      <CKEditor
                        editor={ClassicEditor}
                        data={editorData} 
                        onChange={(_, editor) => {
                          const data = editor.getData();
                          setEditorData(data);
                        }}
                        config={{
                          toolbar: [
                            "heading",
                            "|",
                            "bold",
                            "italic",
                            "link",
                            "bulletedList",
                            "numberedList",
                            "blockQuote",
                            "|",
                            "insertTable",
                            "tableColumn",
                            "tableRow",
                            "mergeTableCells",
                            "|",
                            "undo",
                            "redo",
                            "|",
                          ],
                          image: {
                            toolbar: [
                              "imageTextAlternative",
                              "imageStyle:full",
                              "imageStyle:side",
                            ],
                          },

                          initialData:
                            "<p>Nội dung khởi đầu của bạn ở đây.</p>",
                        }}
                      />
                    </Form.Item>
                  </label>
                </div>
                <Row gutter={[16, 16]}>
                  <Col span={3}>
                    <Form.Item name='isBest' valuePropName='checked'>
                      <Checkbox name='isBest' className='text-white'>
                        Khuyến Mãi
                      </Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item name='isRecentlyAdded' valuePropName='checked'>
                      <Checkbox name='isRecentlyAdded' className='text-white'>
                        Sản phẩm mới về
                      </Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item name='isShowHome' valuePropName='checked'>
                      <Checkbox name='isShowHome' className='text-white'>
                        Hiển thị trang chủ
                      </Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <div className='mt-2'>
                  <Form.Item
                    label={
                      <span className='block mt-4 mb-3 text-sm text-gray-700 dark:text-gray-400'>
                        Ảnh sản phẩm
                      </span>
                    }
                  >
                    <Upload {...uploadProps}>
                      <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                  </Form.Item>
                </div>
                <Form.Item>
                  <button
                    type='submit'
                    className='mt-3 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple'
                  >
                    Thêm mới
                  </button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductAdd;
