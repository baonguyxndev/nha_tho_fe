"use client";
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
  AppstoreOutlined,
  MenuOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "@/library/admin.context";
import type { MenuProps } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

type MenuItem = Required<MenuProps>["items"][number];

const AdminSideBar = () => {
  const { Sider } = Layout;
  const { collapseMenu } = useContext(AdminContext)!;
  const router = useRouter();

  // State lưu key của menu
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // Cập nhật key khi đường dẫn thay đổi
  useEffect(() => {
    const path = window.location.pathname;

    // Xác định selectedKey dựa trên đường dẫn
    const selected = path.split("/").slice(2).join("/"); // Lấy phần sau `/dashboard`
    setSelectedKeys([selected]);

    // Xác định openKeys (mở group cha)
    if (
      selected.startsWith("categories") ||
      selected.startsWith("books") ||
      selected.startsWith("news")
    ) {
      setOpenKeys(["sub4"]); // Mở group "Quản lý"
    }
  }, [router]);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    setSelectedKeys([e.key]); // Cập nhật selectedKeys khi người dùng click
  };

  const items: MenuItem[] = [
    {
      key: "grp",
      label: "Giáo xứ Tân Trang",
      type: "group",
      children: [
        {
          key: "dashboard",
          label: <Link href={"/dashboard"}>Dashboard</Link>,
          icon: <AppstoreOutlined />,
        },
        {
          key: "user",
          label: <Link href={"/dashboard/user"}>Nhân sự</Link>,
          icon: <TeamOutlined />,
        },
        {
          key: "sub4",
          label: "Quản lý",
          icon: <MenuOutlined />,
          children: [
            {
              key: "categories",
              label: <Link href={"/dashboard/categories"}>Danh mục</Link>,
            },
            {
              key: "books",
              label: <Link href={"/dashboard/books"}>Sách</Link>,
            },
            { key: "news", label: <Link href={"/dashboard/news"}>Tin</Link> },
            {
              key: "bible-versions",
              label: (
                <Link href={"/dashboard/bible-versions"}>Bản kinh thánh</Link>
              ),
            },
            {
              key: "ministry-years",
              label: <Link href={"/dashboard/ministry-years"}>Năm mục vụ</Link>,
            },
            {
              key: "chapters",
              label: <Link href={"/dashboard/chapters"}>Chương</Link>,
            },
            {
              key: "verses",
              label: <Link href={"/dashboard/verses"}>Đoạn</Link>,
            },
          ],
        },
      ],
    },
  ];

  return (
    <Sider collapsed={collapseMenu}>
      <Menu
        mode="inline"
        selectedKeys={selectedKeys} // Đồng bộ selectedKeys
        openKeys={openKeys} // Đồng bộ openKeys
        onOpenChange={(keys) => setOpenKeys(keys)} // Cập nhật openKeys khi người dùng mở/đóng
        onClick={handleMenuClick} // Cập nhật selectedKeys khi click
        items={items}
        style={{ height: "100vh" }}
      />
    </Sider>
  );
};

export default AdminSideBar;
