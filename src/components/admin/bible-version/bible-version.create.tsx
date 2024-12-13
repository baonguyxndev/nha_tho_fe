import { handleCreateBibleVersionAction } from "@/utils/actions/bible-version.action";
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

const BibleVersionCreate = (props: IProps) => {
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
      const res = await handleCreateBibleVersionAction(values);
      if (res?.data) {
        handleCloseCreateModal();
        message.success("Tạo danh mục thành công");
      } else {
        notification.error({
          message: "Lỗi tạo danh mục",
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
      title="Tạo danh mục mới"
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
                label="Tên"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên danh mục" },
                ]}
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

export default BibleVersionCreate;
