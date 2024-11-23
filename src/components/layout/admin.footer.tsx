"use client";
import { Layout } from "antd";

const AdminFooter = () => {
  const { Footer } = Layout;
  return (
    <>
      <Footer style={{ textAlign: "center" }}>
        Giáo Xứ Tân Trang © {new Date().getFullYear()}
      </Footer>
    </>
  );
};

export default AdminFooter;
