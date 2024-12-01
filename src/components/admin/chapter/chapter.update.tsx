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
} from "antd";
import { useSession } from "next-auth/react";
import { handleUpdateChapterAction } from "@/utils/actions/chapter.action";

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (v: boolean) => void;
  dataUpdate: any;
  setDataUpdate: any;
}

const ChapterUpdate = (props: IProps) => {
  const { isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate } =
    props;

  const [form] = Form.useForm();
  const { data: session } = useSession();

  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        number: dataUpdate.number,
        bookId: dataUpdate.bookId,
      });
    }
  }, [dataUpdate]);

  const handleCloseUpdateModal = () => {
    form.resetFields();
    setIsUpdateModalOpen(false);
    setDataUpdate(null);
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

  const onFinish = async (values: any) => {
    if (dataUpdate) {
      const { number, bookId } = values;
      const res = await handleUpdateChapterAction({
        _id: dataUpdate._id,
        number,
        bookId,
      });
      if (res?.data) {
        handleCloseUpdateModal();
        message.success("Sửa chương thành công");
      } else {
        notification.error({
          message: "Lỗi sửa chương",
          description: res?.message,
        });
      }
    }
  };

  return (
    <Modal
      title="Sửa chương"
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
      maskClosable={false}
    >
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
              rules={[{ required: true, message: "Vui lòng chọn sách" }]}
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
    </Modal>
  );
};

export default ChapterUpdate;
