"use client";

import { useState, useEffect } from "react";
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
import { handleCreateChapterAction } from "@/utils/actions/chapter.action";

interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (v: boolean) => void;
}

const ChapterCreate = (props: IProps) => {
  const { isCreateModalOpen, setIsCreateModalOpen } = props;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // State for loading
  const { data: session } = useSession();

  const [books, setBooks] = useState<any[]>([]);

  // Hàm đóng modal
  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };

  // Lấy sách
  useEffect(() => {
    const fetchBooks = async () => {
      if (!session?.user?.accessToken) {
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );
        const data = await response.json();
        if (data?.data?.results) {
          setBooks(data.data.results);
        } else {
          message.error("Không thể lấy sách");
        }
      } catch (error: any) {
        message.error("Có lỗi xảy ra khi lấy sách");
      }
    };

    fetchBooks();
  }, [session]);

  // Hàm xử lý submit form
  const onFinish = async (values: any) => {
    setLoading(true); // Start loading
    try {
      const res = await handleCreateChapterAction(values);
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
                label="Chương số"
                name="number"
                rules={[
                  { required: true, message: "Vui lòng nhập chương số mấy" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Sách"
                name="bookId"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn sách",
                  },
                ]}
              >
                <Select placeholder="Chọn sách">
                  {books.map((book) => (
                    <Select.Option key={book._id} value={book._id}>
                      {book.name}
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

export default ChapterCreate;
