import { auth } from "@/auth";
import NewsTable from "@/components/admin/news/news.table";
import { sendRequest } from "@/utils/api";
import { SessionProvider } from "next-auth/react";

interface IProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}
const ManageNewsPage = async (props: IProps) => {
  const current = props?.searchParams?.current ?? 1;
  const pageSize = props?.searchParams?.pageSize ?? 10;
  const session = await auth();

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/news`,
    method: "GET",
    queryParams: {
      current,
      pageSize,
    },
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
    nextOption: {
      next: { tags: ["list-news"] },
    },
  });

  return (
    <div>
      <SessionProvider>
        <NewsTable news={res?.data?.results ?? []} meta={res?.data?.meta} />
      </SessionProvider>
    </div>
  );
};

export default ManageNewsPage;
