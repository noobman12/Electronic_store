import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { SETTINGS } from "../constants/settings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Form,
  Input,
  message,
  Radio,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { useParams } from "react-router-dom";
import { axiosClient } from "../lib/axiosClient";
import { UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { buildSlug } from "../helpers/buildSlug";
// import { UploadProps } from "antd/es/upload";
// import { UploadOutlined } from "@ant-design/icons";
interface ICategory {
  _id?: string;
  category_name?: string;
  description?: string;
  slug?: string;
  imageUrl?: string;
  image?: File | null;
  order?: number;
  isActive?: boolean;
}

const CategoryEdit = () => {
  const [formUpdate] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { id } = useParams();
  const fetchCategoryById = async (id: string) => {
    const url = `${SETTINGS.URL_API}/v1/categories/${id}`;
    const res = await axiosClient.get(url);
    return res.data.data;
  };

  const getCategoryById = useQuery({
    queryKey: ["category", id],
    queryFn: () => fetchCategoryById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (getCategoryById.data) {
      formUpdate.setFieldsValue({
        ...getCategoryById.data,
      });
    }
  }, [getCategoryById.data, formUpdate]);

  const [messageApi, contextHolder] = message.useMessage();

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

  const fetchUpdateCategory = async (payload: ICategory) => {
    const url = `${SETTINGS.URL_API}/v1/categories/${id}`;
    const resUpdate = await axiosClient.put(url, payload);
    return resUpdate.data.data;
  };
  const queryClient = useQueryClient();
  const updateMutationCategory = useMutation({
    mutationFn: fetchUpdateCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Category", id],
      });
      messageApi.open({
        type: "success",
        content: "Cập nhật danh mục thành công!",
      });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Cập nhật danh mục lỗi!",
      });
    },
  });

  const onFinishUpdate = async (values: ICategory) => {
    if (!values.slug) {
      values.slug = buildSlug(String(values.category_name));
    } else if (values.slug) {
      values.slug = buildSlug(String(values.slug));
    }
    if (fileList.length === 0) {
      updateMutationCategory.mutate(values);
    } else {
      const resulUpload = await handleUpload(fileList[0]);
      if (resulUpload !== null) {
        const info_Category = { ...values, imageUrl: resulUpload };
        // Gọi api để thêm Danh mục
        updateMutationCategory.mutate(info_Category);
      }
    }
  };
  const onFinishFailedUpdate = async (errorInfo: unknown) => {
    console.log("ErrorInfo", errorInfo);
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

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Electronics - Sửa danh mục </title>
        <link rel='canonical' href={window.location.href} />
        <meta name='description' content='Sửa danh mục' />
      </Helmet>
      {contextHolder}
      <main className='h-full overflow-y-auto'>
        <div className='container px-6 mx-auto grid'>
          <h2 className='my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200'>
            Danh mục sản phẩm
          </h2>
          <div className='grid grid-cols-12 md:grid-cols-12 gap-[15px]'>
            <div className='col-span-12'>
              <h3 className='mb-3  text-gray-700 dark:text-gray-200'>
                Chỉnh sửa
              </h3>
              <Form
                form={formUpdate}
                name='form-update'
                onFinish={onFinishUpdate}
                onFinishFailed={onFinishFailedUpdate}
                autoComplete='off'
              >
                <div className='grid grid-cols md:grid-cols-2 gap-[15px]'>
                  <Form.Item
                    name='category_name'
                    label={
                      <span className='block mt-4 mb-3 text-sm text-gray-700 dark:text-gray-400'>
                        Tên danh mục
                      </span>
                    }
                    rules={[
                      { required: true, message: "Vui lòng nhập tên danh mục" },
                    ]}
                  >
                    <Input className='!py-[0.625rem] pl-3 block mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray' />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className='block mt-4 mb-3 text-sm text-gray-700 dark:text-gray-400'>
                        Thứ tự
                      </span>
                    }
                    name='order'
                  >
                    <Input
                      min={0}
                      className='pl-3 block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input'
                      type='number'
                    ></Input>
                  </Form.Item>
                </div>
                <div className='gap-[15px]'>
                  <Form.Item
                    label={
                      <span className='block mt-4 mb-3 text-sm text-gray-700 dark:text-gray-400'>
                        Đường dẫn
                      </span>
                    }
                    name='slug'
                  >
                    <Input className='pl-3 block mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray' />
                  </Form.Item>
                </div>
                <div className='gap-[15px]'>
                  <Form.Item
                    name='description'
                    label={
                      <span className='block mt-4 mb-3 text-sm text-gray-700 dark:text-gray-400'>
                        Mô tả
                      </span>
                    }
                  >
                    <TextArea className='pl-3 block mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray' />
                  </Form.Item>
                </div>
                <div className='mt-2'>
                  <Form.Item name='isActive'>
                    <Radio.Group name='isActive' defaultValue={true}>
                      <Radio
                        value={true}
                        className='inline-flex items-center text-purple-600 form-radio focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray'
                      >
                        <span className='ml-2 text-gray-600 dark:text-gray-400'>
                          Công khai
                        </span>
                      </Radio>

                      <Radio
                        value={false}
                        className='ml-6 inline-flex items-center text-purple-600 form-radio focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray'
                      >
                        <span className='ml-2 text-gray-600 dark:text-gray-400'>
                          Không công khai
                        </span>
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>

                <div className='my-2'>
                  <img
                    className='w-[100px] h-[100px] object-cover mb-2'
                    src={
                      getCategoryById.data?.imageUrl &&
                      getCategoryById.data?.imageUrl !== null
                        ? `${SETTINGS.URL_IMAGE}/${getCategoryById.data?.imageUrl}`
                        : `/images/noimage.jpg`
                    }
                    alt={getCategoryById.data?.imageUrl}
                  />
                  <Form.Item
                    label={
                      <span className='block mt-4 mb-3 text-sm text-gray-700 dark:text-gray-400'>
                        Ảnh danh mục
                      </span>
                    }
                  >
                    <Upload {...uploadProps}>
                      <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                  </Form.Item>
                </div>
                <Form.Item>
                  <Button
                    className='pb-[28px] block px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple w-auto'
                    type='primary'
                    htmlType='submit'
                  >
                    Cập nhật
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CategoryEdit;
