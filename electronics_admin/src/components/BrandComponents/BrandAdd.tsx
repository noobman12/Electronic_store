import { useState } from "react";
import { SETTINGS } from "../../constants/settings";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { UploadOutlined } from "@ant-design/icons";
import { axiosClient } from "../../lib/axiosClient";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import { buildSlug } from "../../helpers/buildSlug";
import axios from "axios";

interface IBrand {
  brand_name?: string;
  description?: string;
  slug?: string;
  order?: number;
  isActive?: boolean;
  logo_url?: string;
}

const BrandAdd = () => {
  const [formCreate] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const queryClient = useQueryClient();
  const fetchAddBrand = async (payload: IBrand) => {
    const url = `${SETTINGS.URL_API}/v1/brands`;
    const res = await axiosClient.post(url, payload);
    return res.data;
  };

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

  const createMutationBrand = useMutation({
    mutationFn: fetchAddBrand,
    onSuccess: () => {
      // Clear form
      formCreate.resetFields();
      setFileList([]);
      navigate("/brand?msg=success", { state: { reload: true } });
      queryClient.invalidateQueries({
        queryKey: ["brands"],
      });
      messageApi.open({
        type: "success",
        content: "Thêm thương hiệu thành công",
      });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Thêm thương hiệu lỗi!",
      });
    },
  });

  // Submit form
  const onFinishAdd = async (values: IBrand) => {
    if (!values.slug) {
      values.slug = buildSlug(String(values.brand_name));
    } else if (values.slug) {
      values.slug = buildSlug(String(values.slug));
    }
    if (fileList.length === 0) {
      createMutationBrand.mutate(values);
    } else {
      const resultUpload = await handleUpload(fileList[0]);
      if (resultUpload !== null) {
        const infoBrand = { ...values, logo_url: resultUpload };
        createMutationBrand.mutate(infoBrand);
        console.log(resultUpload);
      }
    }
  };

  const onFinishFailedAdd = (errorInfo: unknown) => {
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
      setFileList([file]);
      return false; // Disable automatic upload
    },
    fileList,
  };

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Electronics - Thêm thương hiệu</title>
        <link rel='canonical' href={window.location.href} />
        <meta name='description' content='Thêm thương hiệu' />
      </Helmet>
      {contextHolder}
      <div className='col-span-12 md:col-span-5'>
        <h3 className='mb-3 text-gray-700 dark:text-gray-200'>Thêm mới</h3>
        <Form
          form={formCreate}
          onFinish={onFinishAdd}
          onFinishFailed={onFinishFailedAdd}
          initialValues={{
            isActive: true, // Default value for isActive
          }}
        >
          <Form.Item
            name='brand_name'
            rules={[
              { required: true, message: "Vui lòng điền tên thương hiệu" },
            ]}
          >
            <label className='block mt-4 text-sm'>
              <span className='text-gray-700 dark:text-gray-400'>
                Tên thương hiệu
              </span>
              <Input className='pl-3 block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input' />
            </label>
          </Form.Item>

          <Form.Item
            label={
              <span className='text-gray-700 dark:text-gray-400'>
                Đường dẫn
              </span>
            }
            name='slug'
          >
            <Input className='pl-3 block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input' />
          </Form.Item>

          <Form.Item name='description'>
            <label className='block mt-4 text-sm'>
              <span className='text-gray-700 dark:text-gray-400'>Mô tả</span>
              <TextArea
                rows={3}
                className='pl-3 block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input'
              />
            </label>
          </Form.Item>

          <Form.Item
            label={
              <span className='text-gray-700 dark:text-gray-400'>Thứ tự</span>
            }
            name='order'
          >
            <Input
              type='number'
              className='pl-3 block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input'
            />
          </Form.Item>

          <Form.Item
            label={
              <span className='block mt-4 mb-3 text-sm text-gray-700 dark:text-gray-400'>
                Trạng thái
              </span>
            }
            name='isActive'
          >
            <Radio.Group>
              <Radio className='text-gray-700 dark:text-gray-400' value={true}>
                Công khai
              </Radio>
              <Radio className='text-gray-700 dark:text-gray-400' value={false}>
                Không công khai
              </Radio>
            </Radio.Group>
          </Form.Item>
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
          <Button
            className='mt-3 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple'
            type='primary'
            htmlType='submit'
          >
            Thêm mới
          </Button>
        </Form>
      </div>
    </>
  );
};

export default BrandAdd;
