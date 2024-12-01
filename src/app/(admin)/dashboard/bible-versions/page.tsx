import { auth } from "@/auth";
import BibleVersionTable from "@/components/admin/bible-version/bible-version.table";
import BookTable from "@/components/admin/book/book.table";
import { sendRequest } from "@/utils/api";

interface IProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}
const ManageBibleVersionsPage = async (props: IProps) => {
  const current = props?.searchParams?.current ?? 1;
  const pageSize = props?.searchParams?.pageSize ?? 10;
  const session = await auth();

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bible-versions`,
    method: "GET",
    queryParams: {
      current,
      pageSize,
    },
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
    nextOption: {
      next: { tags: ["list-bible-versions"] },
    },
  });

  return (
    <div>
      <BibleVersionTable
        bibleVersion={res?.data?.results ?? []}
        meta={res?.data?.meta}
      />
    </div>
  );
};

export default ManageBibleVersionsPage;
