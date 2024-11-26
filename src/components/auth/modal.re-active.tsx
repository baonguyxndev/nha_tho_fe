"use client";
import { useHasMounted } from "@/utils/customHook";
import { Button, Form, Input, message, Modal, notification, Steps } from "antd";
import React, { useEffect, useState } from "react";
import {
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { sendRequest } from "@/utils/api";

const ModalReactive = (props: any) => {
  const { isModalOpen, setIsModalOpen, userEmail } = props;
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [userId, setUserId] = useState("");
  const hasMounted = useHasMounted();

  useEffect(() => {
    if (userEmail) {
      form.setFieldValue("email", userEmail);
    }
  }, [userEmail, form]);

  if (!hasMounted) return null;

  const onFinishStep0 = async (values: any) => {
    const { email } = values;
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/retryActive`,
      method: "POST",
      body: {
        email,
      },
    });
    if (res?.data) {
      setUserId(res?.data._id);
      setCurrent(1);
      message.success(
        "Mã xác thực đã được gửi, vui lòng kiểm tra email của bạn"
      );
    } else {
      notification.error({
        message: "Lỗi gửi mail",
        description: res?.message,
      });
    }
  };

  const onFinishStep1 = async (values: any) => {
    const { code } = values;
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/checkCode`,
      method: "POST",
      body: {
        code,
        _id: userId,
      },
    });
    if (res?.data) {
      setCurrent(2);
      message.success("Tài khoản đã được xác thực");
    } else {
      notification.error({
        message: "Lỗi xác thực !!!",
        description: res?.message,
      });
    }
  };

  return (
    <>
      <Modal
        title="Kích hoạt tài khoản"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        maskClosable={false}
        footer={null}
      >
        <Steps
          current={current}
          items={[
            {
              title: "Đăng nhập",
              icon: <UserOutlined />,
            },
            {
              title: "Xác thực",
              icon: <SolutionOutlined />,
            },
            {
              title: "Hoàn tất",
              icon: <SmileOutlined />,
            },
          ]}
        />

        {current === 0 && (
          <>
            <div style={{ margin: "20px 0" }}>
              Tài khoản của bạn chưa được kích hoạt.
            </div>
            <Form
              name="verify"
              onFinish={onFinishStep0}
              autoComplete="off"
              layout="vertical"
              form={form}
            >
              <Form.Item label="Email" name="email">
                <Input placeholder="Hãy nhập email tài khoản của bạn..." />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Gửi
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        {current === 1 && (
          <>
            <div style={{ margin: "20px 0" }}>
              Vui lòng nhập mã kích hoạt tài khoản.
            </div>
            <Form
              name="verify"
              onFinish={onFinishStep1}
              autoComplete="off"
              layout="vertical"
              form={form}
            >
              <Form.Item
                label="Mã xác thực"
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã xác thực!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Kích hoạt
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        {current === 2 && (
          <>
            <div style={{ margin: "20px 0" }}>
              Tài khoản của bạn đã được kích hoạt thành công. Vui lòng đăng nhập
              lại.
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default ModalReactive;
