"use client";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Button, Popconfirm, Table, Tag, Spin, message } from "antd"; // Thêm Spin từ Ant Design
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { SessionProvider, useSession } from "next-auth/react";
import BookCreate from "./book.create";
import { handleDeleteBookAction } from "@/utils/actions/book.action";
import BookUpdate from "./book.update";

interface IProps {
  books: any;
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
}

const BookTable = (props: IProps) => {
  const { books, meta } = props;
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [bibleVersions, setBibleVersions] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading

  useEffect(() => {
    const fetchBibleVersions = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bible-versions`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          }
        );
        const data = await response.json();
        setBibleVersions(data?.data?.results || []);
      } catch (error) {
        message.error("Có lỗi xảy ra khi lấy danh sách Bible Versions");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.accessToken) {
      fetchBibleVersions();
    }
  }, [session]);

  // Giả sử bạn gọi API ở đây, bạn sẽ cập nhật lại loading sau khi nhận được dữ liệu
  useEffect(() => {
    setLoading(true); // Bắt đầu loading khi component mount
    // Giả lập việc gọi API
    setTimeout(() => {
      // Khi dữ liệu được trả về, cập nhật lại loading
      setLoading(false); // Tắt loading khi dữ liệu đã được tải
    }, 2000); // Giả lập thời gian tải 2 giây (thay bằng thời gian thực từ API)
  }, [books]);

  const columns = [
    {
      title: "STT",
      render: (_: any, record: any, index: any) => {
        return <>{index + 1 + (meta.current - 1) * meta.pageSize}</>;
      },
    },
    {
      title: "Tên",
      dataIndex: "name",
    },
    {
      title: "Bản Kinh Thánh",
      dataIndex: "bibleVersionId",
      render: (bibleVersionId: string) => {
        const bibleVersion = bibleVersions.find(
          (version) => version._id === bibleVersionId
        );
        return bibleVersion ? bibleVersion.name : "Không xác định";
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
              title={"Xác nhận xóa sách"}
              description={"Bạn có chắc chắn muốn xóa sách này ?"}
              onConfirm={async () => await handleDeleteBookAction(record?._id)}
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
            <span>Quản lý sách</span>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Thêm sách
            </Button>
          </div>
          <Table
            bordered
            dataSource={books}
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
        <BookCreate
          isCreateModalOpen={isCreateModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
        />
      </SessionProvider>

      <SessionProvider>
        <BookUpdate
          isUpdateModalOpen={isUpdateModalOpen}
          setIsUpdateModalOpen={setIsUpdateModalOpen}
          dataUpdate={dataUpdate}
          setDataUpdate={setDataUpdate}
        />
      </SessionProvider>
    </>
  );
};

export default BookTable;
