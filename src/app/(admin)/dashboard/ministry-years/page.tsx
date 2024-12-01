import { auth } from "@/auth";
import MinistryYearTable from "@/components/admin/ministry-year/ministry-year.table";
import { sendRequest } from "@/utils/api";

interface IProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}
const ManageMinistryYearsPage = async (props: IProps) => {
  const current = props?.searchParams?.current ?? 1;
  const pageSize = props?.searchParams?.pageSize ?? 10;
  const session = await auth();

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ministryYears`,
    method: "GET",
    queryParams: {
      current,
      pageSize,
    },
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
    nextOption: {
      next: { tags: ["list-ministry-years"] },
    },
  });

  return (
    <div>
      <MinistryYearTable
        ministryYears={res?.data?.results ?? []}
        meta={res?.data?.meta}
      />
    </div>
  );
};

export default ManageMinistryYearsPage;
