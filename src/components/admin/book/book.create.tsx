import { handleCreateBookAction } from "@/utils/actions/book.action";
import { handleCreateCategoryAction } from "@/utils/actions/categoty.action";
import { Modal, Input, Form, Row, Col, message, notification } from "antd";

interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (v: boolean) => void;
}

const BookCreate = (props: IProps) => {
  const { isCreateModalOpen, setIsCreateModalOpen } = props;

  const [form] = Form.useForm();

  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };

  const onFinish = async (values: any) => {
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
  };

  return (
    <Modal
      title="Thêm sách mới"
      open={isCreateModalOpen}
      onOk={() => form.submit()}
      onCancel={() => handleCloseCreateModal()}
      maskClosable={false}
    >
      <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
        <Row gutter={[15, 15]}>
          <Col span={24}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Bible Version"
              name="bibleVersionId"
              rules={[
                { required: true, message: "Please input your bible version" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default BookCreate;
