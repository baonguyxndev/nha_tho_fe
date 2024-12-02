"use client";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Button, Popconfirm, Table, Tag, Spin } from "antd"; // Thêm Spin từ Ant Design
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import BibleVersionCreate from "./bible-version.create";
import BibleVersionUpdate from "./bible-version.update";

interface IProps {
  bibleVersion: any;
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
}

const BibleVersionTable = (props: IProps) => {
  const { bibleVersion, meta } = props;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading

  // Giả lập trạng thái loading khi dữ liệu chưa có
  useEffect(() => {
    if (bibleVersion && bibleVersion.length > 0) {
      setLoading(false); // Khi dữ liệu đã có, tắt trạng thái loading
    } else {
      setLoading(true); // Nếu chưa có dữ liệu, giữ trạng thái loading
    }
  }, [bibleVersion]);

  const columns = [
    {
      title: "STT",
      render: (_: any, record: any, index: any) => {
        return <>{index + 1 + (meta.current - 1) * meta.pageSize}</>;
      },
    },
    {
      title: "Phiên bản",
      dataIndex: "name",
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
        function handleDeleteBibleVersionAction(
          _id: any
        ): void | PromiseLike<void> {
          throw new Error("Function not implemented.");
        }

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
              title={"Xác nhận xóa bản kinh thánh"}
              description={"Bạn có chắc chắn muốn xóa bản kinh thánh này ?"}
              onConfirm={async () =>
                await handleDeleteBibleVersionAction(record?._id)
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
            <span>Quản lý bản kinh thánh</span>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Tạo phiên bản kinh thánh
            </Button>
          </div>
          <Table
            bordered
            dataSource={bibleVersion}
            loading={loading} // Trạng thái loading sẽ hiển thị nếu `loading = true`
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

      <BibleVersionCreate
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />

      <BibleVersionUpdate
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default BibleVersionTable;
