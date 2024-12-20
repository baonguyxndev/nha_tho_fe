import { handleUpdateBookAction } from "@/utils/actions/book.action";
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
import { useSession } from "next-auth/react";

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (v: boolean) => void;
  dataUpdate: any;
  setDataUpdate: any;
}

const BookUpdate = (props: IProps) => {
  const { isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate } =
    props;

  const [form] = Form.useForm();
  const { data: session } = useSession();
  const [bibleVersions, setBibleVersions] = useState<any[]>([]);

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        name: dataUpdate.name,
        bibleVersionId: dataUpdate.bibleVersionId,
      });
    }
  }, [dataUpdate]);

  useEffect(() => {
    const fetchBibleVersions = async () => {
      if (!session?.user?.accessToken) {
        return;
      }

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
      }
    };

    fetchBibleVersions();
  }, [session]);

  const handleCloseUpdateModal = () => {
    form.resetFields();
    setIsUpdateModalOpen(false);
    setDataUpdate(null);
  };

  const onFinish = async (values: any) => {
    if (dataUpdate) {
      const { name, bibleVersionId } = values;
      const res = await handleUpdateBookAction({
        _id: dataUpdate._id,
        name,
        bibleVersionId,
      });
      if (res?.data) {
        handleCloseUpdateModal();
        message.success("Cập nhập thành công");
      } else {
        notification.error({
          message: "Cập nhập lỗi",
          description: res?.message,
        });
      }
    }
  };

  return (
    <Modal
      title="Update a book"
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
      maskClosable={false}
    >
      <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
        <Row gutter={[15, 15]}>
          <Col span={24}>
            <Form.Item
              label="Tên sách"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên sách!" }]}
            >
              <Input />
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
              <Select placeholder="Chọn phiên bản Kinh Thánh">
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
    </Modal>
  );
};

export default BookUpdate;
