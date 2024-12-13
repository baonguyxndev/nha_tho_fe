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
import { useSession } from "next-auth/react"; // Nếu sử dụng next-auth để quản lý session
import { handleCreateVerseAction } from "@/utils/actions/verse.action";
const { TextArea } = Input; // Khai báo TextArea từ Input

interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (v: boolean) => void;
}

const VerseCreate = (props: IProps) => {
  const { isCreateModalOpen, setIsCreateModalOpen } = props;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // State for loading
  const { data: session } = useSession();

  const [chapters, setChapters] = useState<any[]>([]);

  // Hàm đóng modal
  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };

  // Lấy sách
  useEffect(() => {
    const fetchChapters = async () => {
      if (!session?.user?.accessToken) {
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chapters`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );
        const data = await response.json();
        if (data?.data?.results) {
          setChapters(data.data.results);
        } else {
          message.error("Không thể lấy danh sách Bible Versions");
        }
      } catch (error: any) {
        message.error("Có lỗi xảy ra khi lấy danh sách Bible Versions");
      }
    };

    fetchChapters();
  }, [session]);

  // Hàm xử lý submit form
  const onFinish = async (values: any) => {
    setLoading(true); // Start loading
    try {
      const res = await handleCreateVerseAction(values);
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
        description: "Không thể tạo danh mục, vui lòng thử lại.",
      });
    } finally {
      setLoading(false); // Stop loading
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
      <Spin spinning={loading}>
        {" "}
        {/* Bao bọc nội dung modal với Spin */}
        <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
          <Row gutter={[15, 15]}>
            <Col span={24}>
              <Form.Item
                label="Đoạn số"
                name="number"
                rules={[{ required: true, message: "Vui lòng nhập số đoạn" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Chương"
                name="chapterId"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn sách",
                  },
                ]}
              >
                <Select placeholder="Chọn Sách">
                  {chapters.map((chapter) => (
                    <Select.Option key={chapter._id} value={chapter._id}>
                      {chapter.number}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Mô tả"
                name="desc"
                rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
              >
                <TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export default VerseCreate;
