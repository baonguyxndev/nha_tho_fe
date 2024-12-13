import { handleCreateUserAction } from "@/utils/actions/user.action";
import {
  Modal,
  Input,
  Form,
  Row,
  Col,
  message,
  notification,
  Spin,
} from "antd";
import { useState } from "react";

interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (v: boolean) => void;
}

const UserCreate = (props: IProps) => {
  const { isCreateModalOpen, setIsCreateModalOpen } = props;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // State for loading

  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };

  const onFinish = async (values: any) => {
    setLoading(true); // Start loading
    try {
      const res = await handleCreateUserAction(values);
      if (res?.data) {
        handleCloseCreateModal();
        message.success("Thêm nhân sự thành công");
      } else {
        notification.error({
          message: "Lỗi thêm nhân sự",
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
      title="Thêm nhân sự"
      open={isCreateModalOpen}
      onOk={() => form.submit()}
      onCancel={() => handleCloseCreateModal()}
      maskClosable={false}
    >
      <Spin spinning={loading}>
        {" "}
        {/* Bao bọc nội dung modal với Spin */}
        <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
          <Row gutter={[15, 15]}>
            <Col span={24}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input type="email" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Tên"
                name="name"
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export default UserCreate;
