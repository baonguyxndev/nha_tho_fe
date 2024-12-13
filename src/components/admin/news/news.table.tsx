"use client";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Button, message, Popconfirm, Spin, Table, Tag } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { handleDeleteCategoryAction } from "@/utils/actions/categoty.action";
import { SessionProvider, useSession } from "next-auth/react";
import NewsCreate from "./news.create";
// import NewsUpdate from "./news.update";
import { handleDeleteNewsAction } from "@/utils/actions/news.action";
import NewsUpdate from "./news.update";

interface IProps {
  news: any;
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
}

const NewsTable = (props: IProps) => {
  const { news, meta } = props;
  const { data: session } = useSession();
  const [ministryYears, setMinistryYears] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  useEffect(() => {
    if (news && news.length > 0) {
      setLoading(false); // Khi dữ liệu đã có, tắt trạng thái loading
    } else {
      setLoading(true); // Nếu chưa có dữ liệu, giữ trạng thái loading
    }
  }, [news]);

  const columns = [
    {
      title: "STT",
      render: (_: any, record: any, index: any) => {
        return <>{index + 1 + (meta.current - 1) * meta.pageSize}</>;
      },
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
    },
    {
      title: "Mô tả",
      dataIndex: "desc",
    },
    {
      title: "Năm mục vụ",
      dataIndex: "ministryYearId",
      render: (ministryYearId: string) => {
        const ministryYear = ministryYears.find(
          (year) => year._id === ministryYearId
        );
        return ministryYear ? ministryYear.name : "Không xác định";
      },
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
      title: "Ảnh",
      dataIndex: "mainImg",
      render: (imageUrl: string) => (
        <img
          src={imageUrl}
          alt="news-image"
          style={{
            maxWidth: "100px",
            maxHeight: "100px",
            objectFit: "cover",
            borderRadius: "5px",
          }}
        />
      ),
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
      title: "Actions",
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
              title={"Xác nhận xóa tin"}
              description={"Bạn có chắc chắn muốn xóa tin này ?"}
              onConfirm={async () => await handleDeleteNewsAction(record?._id)}
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
            <span>Quản lý tin</span>
            <Button onClick={() => setIsCreateModalOpen(true)}>Thêm tin</Button>
          </div>
          <Table
            bordered
            dataSource={news}
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
        <NewsCreate
          isCreateModalOpen={isCreateModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
        />
      </SessionProvider>

      <SessionProvider>
        <NewsUpdate
          isUpdateModalOpen={isUpdateModalOpen}
          setIsUpdateModalOpen={setIsUpdateModalOpen}
          dataUpdate={dataUpdate}
          setDataUpdate={setDataUpdate}
        />
      </SessionProvider>
    </>
  );
};

export default NewsTable;
