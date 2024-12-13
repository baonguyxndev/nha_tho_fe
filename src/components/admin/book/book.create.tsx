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
  Spin,
} from "antd";
import { useSession } from "next-auth/react";

interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (v: boolean) => void;
}

const BookCreate = (props: IProps) => {
  const { isCreateModalOpen, setIsCreateModalOpen } = props;

  const [form] = Form.useForm();
  const { data: session } = useSession();

  const [bibleVersions, setBibleVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // State for loading spinner
  const [formLoading, setFormLoading] = useState(false); // Loading for form submission

  // Hàm đóng modal
  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };

  // Lấy danh sách Bible Versions
  useEffect(() => {
    const fetchBibleVersions = async () => {
      if (!session?.user?.accessToken) {
        return;
      }

      setLoading(true); // Start loading
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bible-versions`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );
        const data = await response.json();
        if (data?.data?.results) {
          setBibleVersions(data.data.results);
        } else {
          message.error("Không thể lấy danh sách Bible Versions");
        }
      } catch (error: any) {
        message.error("Có lỗi xảy ra khi lấy danh sách Bible Versions");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchBibleVersions();
  }, [session]);

  // Hàm xử lý submit form
  const onFinish = async (values: any) => {
    setFormLoading(true); // Start form submission loading
    try {
      const res = await handleCreateBookAction(values);
      if (res?.data) {
        handleCloseCreateModal();
        message.success("Tạo sách thành công");
      } else {
        notification.error({
          message: "Lỗi tạo sách",
          description: res?.message,
        });
      }
    } catch (error) {
      notification.error({
        message: "Đã xảy ra lỗi",
        description: "Không thể tạo sách, vui lòng thử lại.",
      });
    } finally {
      setFormLoading(false); // Stop form submission loading
    }
  };

  return (
    <Modal
      title="Thêm sách mới"
      open={isCreateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseCreateModal}
      maskClosable={false}
    >
      <Spin spinning={loading || formLoading}>
        {" "}
        {/* Bao bọc nội dung modal */}
        <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
          <Row gutter={[15, 15]}>
            <Col span={24}>
              <Form.Item
                label="Tên sách"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên sách!" }]}
              >
                <Input disabled={formLoading} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Phiên bản Kinh Thánh"
                name="bibleVersionId"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn phiên bản Kinh Thánh",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn phiên bản Kinh Thánh"
                  disabled={formLoading}
                >
                  {bibleVersions.map((version) => (
                    <Select.Option key={version._id} value={version._id}>
                      {version.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export default BookCreate;
