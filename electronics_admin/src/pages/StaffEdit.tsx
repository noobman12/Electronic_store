import {
  Button,
  Form,
  Input,
  message,
  Radio,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { SETTINGS } from "../constants/settings";
import { axiosClient } from "../lib/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import useAuth from "../hooks/useAuth";

interface TStaff {
  first_name: string;
  last_name: string;
  fullname: string;
  phone: string;
  email: string;
  password?: string;
  active?: boolean;
  role?: number;
}
const { Option } = Select;
const StaffEdit = () => {
  const navigate = useNavigate();
  const [formUpdate] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { id } = useParams();
  const { user } = useAuth();
  const fetchStaffById = async (id: string) => {
    const url = `${SETTINGS.URL_API}/v1/staffs/${id}`;
    const res = await axiosClient.get(url);
    return res.data.data;
  };

  const getStaffById = useQuery({
    queryKey: ["staff", id],
    queryFn: () => fetchStaffById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (getStaffById.data) {
      formUpdate.setFieldsValue({
        ...getStaffById.data,
        role: String(getStaffById.data.role),
      });
    }
  }, [getStaffById.data, formUpdate]);

  useEffect(() => {
		if (user?.role !== 1 && user?._id !== getStaffById.data?._id) {
		  navigate("/");
		}
	}, [navigate, user, getStaffById]);

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

  const fetchUpdateStaff = async (payload: TStaff) => {
    const url = `${SETTINGS.URL_API}/v1/staffs/${id}`;
    const resUpdate = await axiosClient.put(url, payload);
    return resUpdate.data.data;
  };
  const queryClient = useQueryClient();
  const updateMutationStaff = useMutation({
    mutationFn: fetchUpdateStaff,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["staff", id],
      });
      messageApi.open({
        type: "success",
        content: "Cập nhật thành viên thành công!",
      });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Cập nhật thành viên lỗi!",
      });
    },
  });

  const onFinishUpdate = async (values: TStaff) => {
    if (!values.password) {
      delete values.password;
    }
    if (fileList.length === 0) {
      updateMutationStaff.mutate(values);
    } else {
      const resulUpload = await handleUpload(fileList[0]);
      if (resulUpload !== null) {
        const info_staff = { ...values, avatar: resulUpload };
        // Gọi api để thêm thành viên
        updateMutationStaff.mutate(info_staff);
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
        <title>Electronics - Sửa nhân viên </title>
        <link rel='canonical' href={window.location.href} />
        <meta name='description' content='Sửa nhân viên' />
      </Helmet>
      {contextHolder}
      <main className='h-full overflow-y-auto'>
        <div className='container px-6 mx-auto grid'>
          <h2 className='my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200'>
            Chỉnh sửa nhân viên
          </h2>
          <div className='grid grid-cols-12 md:grid-cols-12 gap-[15px]'>
            <div className='col-span-12'>
              <Form
                form={formUpdate}
                name='form-update'
                onFinish={onFinishUpdate}
                onFinishFailed={onFinishFailedUpdate}
                autoComplete='off'
              >
                <div className='grid grid-cols-1 md:grid-cols-2 gap-[15px]'>
                  <Form.Item
                    name='first_name'
                    label={
                      <span className='block mt-4 mb-3 text-sm text-gray-700 dark:text-gray-400'>
                        Tên
                      </span>
                    }
                    rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                  >
                    <Input
                      placeholder='Nhập tên của bạn'
                      className='pl-3 block mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray'
                    />
                  </Form.Item>
                  <Form.Item
                    name='last_name'
                    label={
                      <span className='block mt-4 mb-3 text-sm text-gray-700 dark:text-gray-400'>
                        Họ
                      </span>
                    }
                    rules={[{ required: true, message: "Vui lòng nhập họ" }]}
                  >
                    <Input className='pl-3 block mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray' />
                  </Form.Item>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-[15px]'>
                  <Form.Item
                    name='phone'
                    label={
                      <span className='block mt-4 mb-3 text-sm text-gray-700 dark:text-gray-400'>
                        Số điện thoại
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại",
                      },
                      {
                        pattern: /^0\d{9}$/,
                        message: "Số điện thoại chưa đúng",
                      },
                    ]}
                  >
                    <Input className='pl-3 block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input' />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className='block mt-4 mb-3 text-sm text-gray-700 dark:text-gray-400'>
                        Email
                      </span>
                    }
                    name='email'
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      {
                        type: "email",
                        message: "Vui lòng nhập đúng định dạng email",
                      },
                    ]}
                  >
                    <Input
                      disabled
                      className='pl-3 block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input'
                    />
                  </Form.Item>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-[15px]'>
                  <Form.Item
                    label={
                      <span className='block mt-4 mb-3 text-sm text-gray-700 dark:text-gray-400'>
                        Mật khẩu
                      </span>
                    }
                    name='password'
                  >
                    <Input
                      type='password'
                      className='pl-3 block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input'
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <span className='block mt-4 mb-3 text-sm text-gray-700 dark:text-gray-400'>
                        Vai trò
                      </span>
                    }
                    name='role'
                  >
                    <Select
                      disabled={user?.role !== 1}
                      className='w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray'
                    >
                      <Option value='1'>Quản trị viên</Option>
                      <Option value='2'>Thành viên</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className='mt-2'>
                  <Form.Item name='active'>
                    <Radio.Group name='active'>
                      <Radio
                        value={true}
                        className='inline-flex items-center text-purple-600 form-radio focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray'
                      >
                        <span className='ml-2 text-gray-600 dark:text-gray-400'>
                          Kích hoạt
                        </span>
                      </Radio>

                      <Radio
                        value={false}
                        className='ml-6 inline-flex items-center text-purple-600 form-radio focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray'
                      >
                        <span className='ml-2 text-gray-600 dark:text-gray-400'>
                          Tạm khóa
                        </span>
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
                <div className='my-2'>
                  <img
                    className='w-[100px] h-[100px] object-cover mb-2'
                    src={
                      getStaffById.data?.avatar &&
                      getStaffById.data?.avatar !== null
                        ? `${SETTINGS.URL_IMAGE}/${getStaffById.data?.avatar}`
                        : `/images/noavatar.png`
                    }
                    alt={getStaffById.data?.fullname}
                  />
                  <Form.Item
                    label={
                      <span className='block mt-4 mb-3 text-sm text-gray-700 dark:text-gray-400'>
                        Ảnh đại diện
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


export default StaffEdit;