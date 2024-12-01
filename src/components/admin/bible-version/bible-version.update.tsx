import { handleUpdateBibleVersionAction } from "@/utils/actions/bible-version.action";
import { Modal, Input, Form, Row, Col, message, notification } from "antd";
import { useEffect } from "react";

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (v: boolean) => void;
  dataUpdate: any;
  setDataUpdate: any;
}

const BibleVersionUpdate = (props: IProps) => {
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
      const { name, phone, address } = values;
      const res = await handleUpdateBibleVersionAction({
        _id: dataUpdate._id,
        name,
      });
      if (res?.data) {
        handleCloseUpdateModal();
        message.success("Sửa bản Kinh Thánh thành công");
      } else {
        notification.error({
          message: "Lỗi sửa bản Kinh Thánh",
          description: res?.message,
        });
      }
    }
  };

  return (
    <Modal
      title="Sửa bản Kinh Thánh"
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={() => handleCloseUpdateModal()}
      maskClosable={false}
    >
      <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
        <Row gutter={[15, 15]}>
          <Col span={24} md={12}>
            <Form.Item
              label="Bản Kinh Thánh"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên bản Kinh Thánh" },
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

export default BibleVersionUpdate;
