"use client";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Button, message, Popconfirm, Spin, Table, Tag } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { handleDeleteCategoryAction } from "@/utils/actions/categoty.action";
import { SessionProvider, useSession } from "next-auth/react";
import MinistryYearCreate from "./ministry-year.create";
import MinistryYearUpdate from "./ministry-year.update";

interface IProps {
  ministryYears: any;
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
}

const MinistryYearTable = (props: IProps) => {
  const { ministryYears, meta } = props;
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Lấy danh sách Category
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
          message.error("Không thể lấy danh sách Bible Versions");
        }
      } catch (error: any) {
        message.error("Có lỗi xảy ra khi lấy danh sách Bible Versions");
      }
    };

    fetchCategories();
  }, [session]);

  useEffect(() => {
    if (ministryYears && ministryYears.length > 0) {
      setLoading(false); // Khi dữ liệu đã có, tắt trạng thái loading
    } else {
      setLoading(true); // Nếu chưa có dữ liệu, giữ trạng thái loading
    }
  }, [ministryYears]);

  const columns = [
    {
      title: "STT",
      render: (_: any, record: any, index: any) => {
        return <>{index + 1 + (meta.current - 1) * meta.pageSize}</>;
      },
    },
    {
      title: "Tên năm",
      dataIndex: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "desc",
    },
    {
      title: "Danh mục",
      dataIndex: "cateId",
      render: (cateId: string) => {
        const category = categories.find((category) => category._id === cateId);
        return category ? category.name : "Không xác định";
      },
    },
    {
      title: "Tạo lúc",
      dataIndex: "createdAt",
      render: (createdAt: string) =>
        dayjs(createdAt).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Sửa lúc",
      dataIndex: "updatedAt",
      render: (updatedAt: string) =>
        dayjs(updatedAt).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Chức năng",
      render: (text: any, record: any, index: any) => {
        return (
          <>
            <EditTwoTone
              twoToneColor="#f57800"
              style={{ cursor: "pointer", margin: "0 20px" }}
              onClick={() => {
                setIsUpdateModalOpen(true);
                setDataUpdate(record);
              }}
            />
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa năm mục vụ"}
              description={"Bạn có chắc chắn muốn xóa năm mục vụ này ?"}
              onConfirm={async () =>
                await handleDeleteCategoryAction(record?._id)
              }
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <span style={{ cursor: "pointer" }}>
                <DeleteTwoTone twoToneColor="#ff4d4f" />
              </span>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    if (pagination && pagination.current) {
      const params = new URLSearchParams(searchParams);
      params.set("current", pagination.current);
      replace(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <>
      {/* Hiển thị vòng loading */}
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Spin size="large" /> {/* Hiển thị vòng loading */}
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <span>Quản lý năm mục vụ</span>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Thêm năm mục vụ
            </Button>
          </div>
          <Table
            bordered
            dataSource={ministryYears}
            loading={loading}
            columns={columns}
            rowKey={"_id"}
            pagination={{
              current: meta?.current,
              pageSize: meta?.pageSize,
              showSizeChanger: true,
              total: meta?.total,
              showTotal: (total, range) => {
                return (
                  <div>
                    {" "}
                    {range[0]}-{range[1]} trên {total} rows
                  </div>
                );
              },
            }}
            onChange={onChange}
          />
        </>
      )}
      <SessionProvider>
        <MinistryYearCreate
          isCreateModalOpen={isCreateModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
        />
      </SessionProvider>

      <SessionProvider>
        <MinistryYearUpdate
          isUpdateModalOpen={isUpdateModalOpen}
          setIsUpdateModalOpen={setIsUpdateModalOpen}
          dataUpdate={dataUpdate}
          setDataUpdate={setDataUpdate}
        />
      </SessionProvider>
    </>
  );
};

export default MinistryYearTable;
