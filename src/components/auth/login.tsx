"use client";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  notification,
  Row,
  Spin,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ModalReactive from "./modal.re-active";
import { useState } from "react";
import ModalChangePassword from "./modal.change.password";
import { authenticate } from "@/utils/actions/user.action";

const Login = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading

  const onFinish = async (values: any) => {
    const { email, password } = values;
    setLoading(true); // Start loading
    try {
      const res = await authenticate(email, password);
      if (res?.error) {
        notification.error({
          message: "Lỗi đăng nhập",
          description: res?.error,
        });
        if (res?.code === 2) {
          setIsModalOpen(true);
        }
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      notification.error({
        message: "Đã xảy ra lỗi",
        description: "Không thể đăng nhập, vui lòng thử lại.",
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      {loading ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 1000,
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Row justify={"center"} style={{ marginTop: "30px" }}>
          <Col xs={24} md={16} lg={8}>
            <fieldset
              style={{
                padding: "15px",
                margin: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <legend>Đăng Nhập</legend>
              <Form
                name="basic"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập email",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Button type="primary" htmlType="submit">
                      Login
                    </Button>
                    <Button type="link" onClick={() => setChangePassword(true)}>
                      Quên mật khẩu ?
                    </Button>
                  </div>
                </Form.Item>
              </Form>
              <Divider />
              <div style={{ textAlign: "center" }}>
                Chưa có tài khoản?{" "}
                <Link href={"/auth/register"}>Đăng ký tại đây</Link>
              </div>
            </fieldset>
          </Col>
        </Row>
      )}
      <ModalReactive
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <ModalChangePassword
        isModalOpen={changePassword}
        setIsModalOpen={setChangePassword}
      />
    </>
  );
};

export default Login;
