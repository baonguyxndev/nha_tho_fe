import { auth } from "@/auth";
import BookTable from "@/components/admin/book/book.table";
import ChapterTable from "@/components/admin/chapter/chapter.table";
import { sendRequest } from "@/utils/api";
import { SessionProvider } from "next-auth/react";

interface IProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}
const ManageChaptersPage = async (props: IProps) => {
  const current = props?.searchParams?.current ?? 1;
  const pageSize = props?.searchParams?.pageSize ?? 10;
  const session = await auth();

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chapters`,
    method: "GET",
    queryParams: {
      current,
      pageSize,
    },
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
    nextOption: {
      next: { tags: ["list-chapters"] },
    },
  });

  return (
    <div>
      <SessionProvider>
        <ChapterTable
          chapters={res?.data?.results ?? []}
          meta={res?.data?.meta}
        />
      </SessionProvider>
    </div>
  );
};

export default ManageChaptersPage;
