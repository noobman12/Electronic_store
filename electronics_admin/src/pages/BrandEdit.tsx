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

interface TBrand {
  _id?: string;
  brand_name?: string;
  description?: string;
  slug?: string;
  logo_url?: string;
  image?: File | null;
  order?: number;
  isActive?: boolean;
}

const BrandEdit = () => {
  const [formUpdate] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { id } = useParams();
  const fetchBrandById = async (id: string) => {
    const url = `${SETTINGS.URL_API}/v1/brands/${id}`;
    const res = await axiosClient.get(url);
    return res.data.data;
  };

  const getBrandById = useQuery({
    queryKey: ["Brand", id],
    queryFn: () => fetchBrandById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (getBrandById.data) {
      formUpdate.setFieldsValue({
        ...getBrandById.data,
      });
    }
  }, [getBrandById.data, formUpdate]);

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

  const fetchUpdateBrand = async (payload: TBrand) => {
    const url = `${SETTINGS.URL_API}/v1/brands/${id}`;
    const resUpdate = await axiosClient.put(url, payload);
    return resUpdate.data.data;
  };
  const queryClient = useQueryClient();
  const updateMutationBrand = useMutation({
    mutationFn: fetchUpdateBrand,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Brand", id],
      });
      messageApi.open({
        type: "success",
        content: "Cập nhật thương hiệu thành công!",
      });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Cập nhật thương hiệu lỗi!",
      });
    },
  });

  const onFinishUpdate = async (values: TBrand) => {
    if (!values.slug) {
      values.slug = buildSlug(String(values.brand_name));
    } else if (values.slug) {
      values.slug = buildSlug(String(values.slug));
    }
    if (fileList.length === 0) {
      updateMutationBrand.mutate(values);
    } else {
      const resulUpload = await handleUpload(fileList[0]);
      if (resulUpload !== null) {
        const info_Brand = { ...values, logo_url: resulUpload };
        // Gọi api để thêm Danh mục
        updateMutationBrand.mutate(info_Brand);
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
        <title>Electronics - Sửa thương hiệu</title>
        <link rel='canonical' href={window.location.href} />
        <meta name='description' content='Sửa thương hiệu' />
      </Helmet>
      {contextHolder}
      <main className='h-full overflow-y-auto'>
        <div className='container px-6 mx-auto grid'>
          <h2 className='my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200'>
            Thương hiệu sản phẩm
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
                    name='brand_name'
                    label={
                      <span className='block mt-4 mb-3 text-sm text-gray-700 dark:text-gray-400'>
                        Tên thương hiệu
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng điền tên thương hiệu",
                      },
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
                      className='pl-3 block mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input'
                      type='number'
                    ></Input>
                  </Form.Item>
                </div>
                <div className='  '>
                  <Form.Item
                    label={
                      <span className='block mt-4 mb-3 text-sm text-gray-700 dark:text-gray-400'>
                        Đường dẫn
                      </span>
                    }
                    name='slug'
                    rules={[
                      { max: 50, message: "Độ dài không được quá 50 ký tự" },
                    ]}
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
                      getBrandById.data?.logo_url &&
                      getBrandById.data?.logo_url !== null
                        ? `${SETTINGS.URL_IMAGE}/${getBrandById.data?.logo_url}`
                        : `/images/noimage.jpg`
                    }
                    alt={getBrandById.data?.logo_url}
                  />
                  <Form.Item
                    label={
                      <span className='block mt-4 mb-3 text-sm text-gray-700 dark:text-gray-400'>
                        Ảnh thương hiệu
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

export default BrandEdit;
