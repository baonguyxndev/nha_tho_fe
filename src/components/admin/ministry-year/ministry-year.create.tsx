"use client";

import { useState, useEffect } from "react";
import { handleCreateBookAction } from "@/utils/actions/book.action";
import {
  Modal,
  Input,
  Form,
  Row,
  Col,
  message,
  notification,
  Select,
} from "antd";
import { useSession } from "next-auth/react"; // Nếu sử dụng next-auth để quản lý session
import { handleCreateMinistryYearAction } from "@/utils/actions/ministry-year.action";

interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (v: boolean) => void;
}

const MinistryYearCreate = (props: IProps) => {
  const { isCreateModalOpen, setIsCreateModalOpen } = props;

  const [form] = Form.useForm();
  const { data: session } = useSession();

  const [categories, setCategories] = useState<any[]>([]);

  // Hàm đóng modal
  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };

  // Lấy danh sách Bible Versions
  useEffect(() => {
    const fetchCategories = async () => {
      if (!session?.user?.accessToken) {
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );
        const data = await response.json();
        if (data?.data?.results) {
          setCategories(data.data.results);
        } else {
          message.error("Không thể lấy danh sách Bible Versions");
        }
      } catch (error: any) {
        message.error("Có lỗi xảy ra khi lấy danh sách Bible Versions");
      }
    };

    fetchCategories();
  }, [session]);

  // Hàm xử lý submit form
  const onFinish = async (values: any) => {
    console.log("values ", values);
    const res = await handleCreateMinistryYearAction(values);
    console.log("res ", res);
    if (res?.data) {
      handleCloseCreateModal();
      message.success("Tạo năm mục vụ thành công");
    } else {
      notification.error({
        message: "Lỗi tạo năm mục vụ",
        description: res?.message,
      });
    }
  };

  return (
    <Modal
      title="Thêm năm mục vụ"
      open={isCreateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseCreateModal}
      maskClosable={false}
    >
      <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
        <Row gutter={[15, 15]}>
          <Col span={24}>
            <Form.Item
              label="Tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên sách" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Mô tả"
              name="desc"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Danh mục"
              name="cateId"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn danh mục",
                },
              ]}
            >
              <Select placeholder="Chọn danh mục">
                {categories.map((cate) => (
                  <Select.Option key={cate._id} value={cate._id}>
                    {cate.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default MinistryYearCreate;
