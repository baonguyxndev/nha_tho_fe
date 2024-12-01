import { handleUpdateVerseAction } from "@/utils/actions/verse.action";
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
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // Nếu sử dụng next-auth để quản lý session
const { TextArea } = Input;

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (v: boolean) => void;
  dataUpdate: any;
  setDataUpdate: any;
}

const VerseUpdate = (props: IProps) => {
  const { isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate } =
    props;

  const [form] = Form.useForm();
  const { data: session } = useSession();
  const [chapters, setChapters] = useState<any[]>([]);

  useEffect(() => {
    // Nạp danh sách chương
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
          message.error("Không thể lấy danh sách chương");
        }
      } catch (error: any) {
        message.error("Có lỗi xảy ra khi lấy danh sách chương");
      }
    };

    fetchChapters();
  }, [session]);

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        number: dataUpdate.number,
        desc: dataUpdate.desc,
        chapterId: dataUpdate.chapterId,
      });
    }
  }, [dataUpdate]);

  const handleCloseUpdateModal = () => {
    form.resetFields();
    setIsUpdateModalOpen(false);
    setDataUpdate(null);
  };

  const onFinish = async (values: any) => {
    if (dataUpdate) {
      const { number, desc, chapterId } = values;
      const res = await handleUpdateVerseAction({
        _id: dataUpdate._id,
        number,
        desc,
        chapterId,
      });
      if (res?.data) {
        handleCloseUpdateModal();
        message.success("Sửa đoạn thành công");
      } else {
        notification.error({
          message: "Lỗi sửa đoạn",
          description: res?.message,
        });
      }
    }
  };

  return (
    <Modal
      title="Sửa đoạn"
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
      maskClosable={false}
    >
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
              rules={[{ required: true, message: "Vui lòng chọn chương" }]}
            >
              <Select placeholder="Chọn Chương">
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
    </Modal>
  );
};

export default VerseUpdate;
