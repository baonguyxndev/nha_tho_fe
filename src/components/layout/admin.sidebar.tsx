"use client";
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
  AimOutlined,
  AppstoreOutlined,
  CodeOutlined,
  DownOutlined,
  MailOutlined,
  ManOutlined,
  MenuOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import React, { useContext } from "react";
import { AdminContext } from "@/library/admin.context";
import type { MenuProps } from "antd";
import Link from "next/link";

type MenuItem = Required<MenuProps>["items"][number];
const AdminSideBar = () => {
  const { Sider } = Layout;
  const { collapseMenu } = useContext(AdminContext)!;

  const items: MenuItem[] = [
    {
      key: "grp",
      label: "Hỏi Dân IT",
      type: "group",
      children: [
        {
          key: "dashboard",
          label: <Link href={"/dashboard"}>Dashboard</Link>,
          icon: <AppstoreOutlined />,
        },
        {
          key: "users",
          label: <Link href={"/dashboard/user"}>Nhân sự</Link>,
          icon: <TeamOutlined />,
        },
        {
          key: "sub4",
          label: "Quản lý",
          icon: <MenuOutlined />,
          children: [
            {
              key: "1",
              label: <Link href={"/dashboard/categories"}>Danh mục</Link>,
            },
            { key: "2", label: <Link href={"/dashboard/books"}>Sách</Link> },
            { key: "3", label: <Link href={"/dashboard/news"}>Tin</Link> },
            {
              key: "4",
              label: (
                <Link href={"/dashboard/bible-versions"}>Bản kinh thánh</Link>
              ),
            },
            {
              key: "5",
              label: <Link href={"/dashboard/ministry-years"}>Năm mục vụ</Link>,
            },
            {
              key: "6",
              label: <Link href={"/dashboard/chapters"}>Chương</Link>,
            },
            { key: "7", label: <Link href={"/dashboard/verses"}>Đoạn</Link> },
          ],
        },
      ],
    },
  ];

  return (
    <Sider collapsed={collapseMenu}>
      <Menu
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        items={items}
        style={{ height: "100vh" }}
      />
    </Sider>
  );
};

export default AdminSideBar;
