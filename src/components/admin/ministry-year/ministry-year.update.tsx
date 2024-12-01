import { useEffect, useState } from "react";
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
import { handleUpdateMinistryYearAction } from "@/utils/actions/ministry-year.action";
import { useSession } from "next-auth/react";

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (v: boolean) => void;
  dataUpdate: any;
  setDataUpdate: any;
}

const MinistryYearUpdate = (props: IProps) => {
  const { isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate } =
    props;

  const [form] = Form.useForm();
  const { data: session } = useSession();
  const [categories, setCategories] = useState<any[]>([]);

  // Tải danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      if (!session?.user?.accessToken) {
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );
        const data = await response.json();
        if (data?.data?.results) {
          setCategories(data.data.results);
        } else {
          message.error("Không thể lấy danh sách danh mục");
        }
      } catch (error: any) {
        message.error("Có lỗi xảy ra khi lấy danh sách danh mục");
      }
    };

    fetchCategories();
  }, [session]);

  // Gán dữ liệu vào form khi mở modal
  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        name: dataUpdate.name,
        desc: dataUpdate.desc,
        cateId: dataUpdate.cateId,
      });
    }
  }, [dataUpdate]);

  // Đóng modal
  const handleCloseUpdateModal = () => {
    form.resetFields();
    setIsUpdateModalOpen(false);
    setDataUpdate(null);
  };

  // Xử lý cập nhật
  const onFinish = async (values: any) => {
    const { name, desc, cateId } = values;
    const res = await handleUpdateMinistryYearAction({
      _id: dataUpdate._id,
      name,
      desc,
      cateId,
    });

    if (res?.data) {
      handleCloseUpdateModal();
      message.success("Cập nhật thành công");
    } else {
      notification.error({
        message: "Lỗi cập nhật",
        description: res?.message,
      });
    }
  };

  return (
    <Modal
      title="Cập nhật năm mục vụ"
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
      maskClosable={false}
    >
      <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
        <Row gutter={[15, 15]}>
          <Col span={24}>
            <Form.Item
              label="Tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Mô tả"
              name="desc"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Danh mục"
              name="cateId"
              rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
            >
              <Select placeholder="Chọn danh mục">
                {categories.map((cate) => (
                  <Select.Option key={cate._id} value={cate._id}>
                    {cate.name}
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

export default MinistryYearUpdate;
