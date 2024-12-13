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
  Upload,
  Spin,
} from "antd";
import { useSession } from "next-auth/react"; // Nếu sử dụng next-auth để quản lý session
import { PlusOutlined } from "@ant-design/icons";
import { handleCreateNewsAction } from "@/utils/actions/news.action";
import { normFile } from "@/utils/helper";

const { TextArea } = Input; // Khai báo TextArea từ Input

interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (v: boolean) => void;
}

const NewsCreate = (props: IProps) => {
  const { isCreateModalOpen, setIsCreateModalOpen } = props;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // State for loading
  const { data: session } = useSession();

  const [ministryYear, setMinistryYears] = useState<any[]>([]);
  const [category, setCategories] = useState<any[]>([]);

  const [fileList, setFileList] = useState<any[]>([]);

  // Hàm đóng modal
  const handleCloseCreateModal = () => {
    form.resetFields();
    setFileList([]); // Đặt lại danh sách ảnh khi đóng modal
    setIsCreateModalOpen(false); // Đóng modal
  };

  // Lấy danh sách Ministry Years và Categories
  useEffect(() => {
    const fetchMinistryYears = async () => {
      if (!session?.user?.accessToken) {
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ministryYears`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );
        const data = await response.json();
        if (data?.data?.results) {
          setMinistryYears(data.data.results);
        } else {
          message.error("Không thể lấy danh sách Ministry Year");
        }
      } catch (error: any) {
        message.error("Có lỗi xảy ra khi lấy danh sách Ministry Year");
      }
    };

    const fetchCategory = async () => {
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
          message.error("Không thể lấy danh sách Category");
        }
      } catch (error: any) {
        message.error("Có lỗi xảy ra khi lấy danh sách Category");
      }
    };

    fetchMinistryYears();
    fetchCategory();
  }, [session]);

  // Hàm xử lý submit form
  const onFinish = async (values: any) => {
    setLoading(true); // Start loading
    try {
      const formData = new FormData();

      // Thêm các giá trị từ form vào formData
      Object.keys(values).forEach((key) => {
        if (key !== "image") {
          formData.append(key, values[key]);
        }
      });

      // Thêm ảnh vào formData
      if (fileList.length > 0) {
        formData.append("mainImg", fileList[0].originFileObj); // Sử dụng originFileObj để lấy file thực tế
      }

      // Gọi hàm handleCreateNewsAction để gửi FormData
      const res = await handleCreateNewsAction(formData);

      if (res?.data) {
        handleCloseCreateModal();
        message.success("Tạo tin thành công");
      } else {
        notification.error({
          message: "Lỗi tạo tin",
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
      title="Thêm tin mới"
      open={isCreateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseCreateModal}
      maskClosable={false}
      width={800} // Thiết lập width của Modal để không bị tràn
      centered
    >
      <Spin spinning={loading}>
        {" "}
        {/* Bao bọc nội dung modal với Spin */}
        <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
          <Row gutter={[15, 15]}>
            <Col xs={24} sm={12} md={12} lg={12}>
              <Form.Item
                label="Tiêu đề"
                name="title"
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={12} lg={12}>
              <Form.Item
                label="Năm mục vụ"
                name="ministryYearId"
                rules={[
                  { required: true, message: "Vui lòng chọn năm mục vụ" },
                ]}
              >
                <Select placeholder="Chọn năm mục vụ">
                  {ministryYear.map((year) => (
                    <Select.Option key={year._id} value={year._id}>
                      {year.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={12} lg={12}>
              <Form.Item
                label="Mô tả"
                name="desc"
                rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
              >
                <TextArea rows={4} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={12} lg={12}>
              <Form.Item
                label="Danh mục"
                name="cateId"
                rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
              >
                <Select placeholder="Chọn danh mục">
                  {category.map((cate) => (
                    <Select.Option key={cate._id} value={cate._id}>
                      {cate.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Phần chọn ảnh */}
            <Col span={24}>
              <Form.Item
                label="Upload ảnh"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                name="image"
                rules={[{ required: true, message: "Vui lòng chọn ảnh" }]}
              >
                <Upload
                  action="/upload.do"
                  listType="picture-card"
                  onChange={({ fileList }) => setFileList(fileList)}
                  beforeUpload={() => false} // Ngăn không upload tự động khi chọn ảnh
                >
                  <button
                    style={{ border: 0, background: "none" }}
                    type="button"
                  >
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export default NewsCreate;
