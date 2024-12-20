import { handleUpdateCategoryAction } from "@/utils/actions/categoty.action";
import { Modal, Input, Form, Row, Col, message, notification } from "antd";
import { useEffect } from "react";

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (v: boolean) => void;
  dataUpdate: any;
  setDataUpdate: any;
}

const CategoryUpdate = (props: IProps) => {
  const { isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate } =
    props;

  const [form] = Form.useForm();

  useEffect(() => {
    if (dataUpdate) {
      //code
      form.setFieldsValue({
        name: dataUpdate.name,
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
      const { name } = values;
      const res = await handleUpdateCategoryAction({
        _id: dataUpdate._id,
        name,
      });
      if (res?.data) {
        handleCloseUpdateModal();
        message.success("Sửa danh mục thành công");
      } else {
        notification.error({
          message: "Lỗi sửa danh mục ",
          description: res?.message,
        });
      }
    }
  };

  return (
    <Modal
      title="Sửa danh mục"
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={() => handleCloseUpdateModal()}
      maskClosable={false}
    >
      <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
        <Row gutter={[15, 15]}>
          <Col span={24} md={12}>
            <Form.Item
              label="Tên danh mục"
              name="name"
              rules={[
                { required: true, message: "Vui lòng điền tên danh mục" },
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

export default CategoryUpdate;
