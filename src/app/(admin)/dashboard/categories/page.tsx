import { auth } from "@/auth";
import CategoryTable from "@/components/admin/category/category.table";
import { sendRequest } from "@/utils/api";

interface IProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}
const ManageCategoriesPage = async (props: IProps) => {
  const current = props?.searchParams?.current ?? 1;
  const pageSize = props?.searchParams?.pageSize ?? 10;
  const session = await auth();

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`,
    method: "GET",
    queryParams: {
      current,
      pageSize,
    },
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
    nextOption: {
      next: { tags: ["list-categories"] },
    },
  });

  return (
    <div>
      <CategoryTable
        categories={res?.data?.results ?? []}
        meta={res?.data?.meta}
      />
    </div>
  );
};

export default ManageCategoriesPage;
