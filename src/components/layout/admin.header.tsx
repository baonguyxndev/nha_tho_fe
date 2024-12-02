"use client";
import { AdminContext } from "@/library/admin.context";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Spin, Dropdown, Space } from "antd";
import { useState, useContext } from "react";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { signOut } from "next-auth/react";

const AdminHeader = (props: any) => {
  const session = props;
  const { Header } = Layout;
  const { collapseMenu, setCollapseMenu } = useContext(AdminContext)!;
  const [loading, setLoading] = useState(false); // State quản lý loading

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <span>Cài đặt</span>,
    },
    {
      key: "2",
      danger: true,
      label: (
        <span
          onClick={async () => {
            setLoading(true); // Hiển thị loading
            try {
              await signOut();
            } finally {
              setLoading(false); // Tắt loading
            }
          }}
        >
          Đăng xuất
        </span>
      ),
    },
  ];

  return (
    <>
      {/* Overlay loading */}
      {loading && (
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
          <Spin size="large" tip="Đang xử lý..." />
        </div>
      )}
      <Header
        style={{
          padding: 0,
          display: "flex",
          background: "#f5f5f5",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          type="text"
          icon={collapseMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapseMenu(!collapseMenu)}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />
        <Dropdown menu={{ items }}>
          <a
            onClick={(e) => e.preventDefault()}
            style={{
              color: "unset",
              lineHeight: "0 !important",
              marginRight: 20,
            }}
          >
            <Space>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                {session?.session?.user?.name ?? "Admin"}
              </span>{" "}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Header>
    </>
  );
};

export default AdminHeader;
