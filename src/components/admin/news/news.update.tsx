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
} from "antd";
import { useSession } from "next-auth/react"; // Nếu sử dụng next-auth để quản lý session
import { PlusOutlined } from "@ant-design/icons";
import { handleUpdateNewsAction } from "@/utils/actions/news.action";
import { normFile } from "@/utils/helper";

const { TextArea } = Input; // Khai báo TextArea từ Input

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (v: boolean) => void;
  dataUpdate: any;
  setDataUpdate: any;
}

const NewsCreate = (props: IProps) => {
  const { isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate } =
    props;

  const [form] = Form.useForm();
  const { data: session } = useSession();
  const [ministryYear, setMinistryYears] = useState<any[]>([]);
  const [category, setCategories] = useState<any[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);

  // Hàm đóng modal
  const handleCloseUpdateModal = () => {
    form.resetFields();
    setFileList([]); // Reset lại fileList khi đóng modal
    setIsUpdateModalOpen(false);
    setDataUpdate(null);
  };

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

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        title: dataUpdate.title,
        desc: dataUpdate.desc,
        ministryYearId: dataUpdate.ministryYearId,
        cateId: dataUpdate.cateId,
      });

      // Nếu có ảnh đã chọn trước đó, thiết lập giá trị cho fileList
      if (dataUpdate.mainImg) {
        setFileList([
          {
            uid: "-1", // Giá trị duy nhất
            name: "Ảnh hiện tại", // Tên hiển thị
            status: "done", // Trạng thái đã upload
            url: dataUpdate.mainImg, // URL ảnh
          },
        ]);
      }
    }
  }, [dataUpdate]);

  // Hàm xử lý submit form
  const onFinish = async (values: any) => {
    const formData = new FormData();

    // Thêm các giá trị từ form vào formData
    Object.keys(values).forEach((key) => {
      if (key !== "image") {
        // Đảm bảo không gửi trường image dưới dạng text
        formData.append(key, values[key]);
      }
    });

    // Thêm ảnh vào formData nếu có
    if (fileList.length > 0 && fileList[0]?.originFileObj) {
      formData.append("mainImg", fileList[0].originFileObj); // Sử dụng originFileObj để lấy file thực tế
    }

    // Thêm _id của tin tức vào formData
    if (dataUpdate && dataUpdate._id) {
      formData.append("_id", dataUpdate._id); // Thêm _id để đảm bảo server nhận diện bản tin cần cập nhật
    }

    // Gọi hàm handleUpdateNewsAction để gửi FormData
    const res = await handleUpdateNewsAction(formData);

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
      title="Cập nhật tin tức"
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
      maskClosable={false}
      width={800} // Thiết lập width của Modal để không bị tràn
      centered
    >
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
              rules={[{ required: true, message: "Vui lòng chọn năm mục vụ" }]}
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
                listType="picture-card"
                fileList={fileList}
                onChange={({ fileList: newFileList }) => {
                  setFileList(newFileList); // Cập nhật lại fileList
                }}
                beforeUpload={() => false} // Ngăn không cho ảnh được upload ngay lập tức
                showUploadList={false} // Tắt danh sách mặc định của Antd
              >
                {fileList.length >= 1 ? (
                  <div
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <img
                      src={
                        fileList[0].url ||
                        URL.createObjectURL(fileList[0].originFileObj)
                      }
                      alt="Ảnh hiện tại"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <button
                      type="button"
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        background: "rgba(0, 0, 0, 0.6)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        padding: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => setFileList([])} // Xóa ảnh hiện tại
                    >
                      X
                    </button>
                  </div>
                ) : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default NewsCreate;
