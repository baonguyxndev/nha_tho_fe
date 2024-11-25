"use client";
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
  AppstoreOutlined,
  MailOutlined,
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
          label: <Link href={"/dashboard/user"}>Manage Users</Link>,
          icon: <TeamOutlined />,
        },
        {
          key: "sub4",
          label: "Managerment",
          icon: <SettingOutlined />,
          children: [
            {
              key: "1",
              label: <Link href={"/dashboard/categories"}>Categories</Link>,
            },
            { key: "2", label: <Link href={"/dashboard/books"}>Books</Link> },
            { key: "3", label: <Link href={"/dashboard/news"}>News</Link> },
            {
              key: "4",
              label: (
                <Link href={"/dashboard/bible-versions"}>Bible Versions</Link>
              ),
            },
            {
              key: "5",
              label: (
                <Link href={"/dashboard/ministry-years"}>Ministry Years</Link>
              ),
            },
            {
              key: "6",
              label: <Link href={"/dashboard/chapters"}>Chapters</Link>,
            },
            { key: "7", label: <Link href={"/dashboard/verses"}>Verses</Link> },
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
