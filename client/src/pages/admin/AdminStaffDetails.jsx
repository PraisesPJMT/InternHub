import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import api from "@/api/api";

import Button from "@/components/ui/button";
import { Link, useNavigate, useParams } from "react-router";
import ErrorState from "@/components/general/ErrorState";

const AdminStaffDetails = () => {
  const { supervisorId } = useParams();
  const navigate = useNavigate();

  const {
    data: staff,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["staff", supervisorId],
    queryFn: async () => {
      // Backend endpoint: GET /supervisors/:id
      const res = await api.get(`/supervisors/${supervisorId}`);
      // Normalize response (api client may unwrap response.data)
      return res?.data ?? res;
    },
    onError: (error) => {
      console.error("Staff fetch error: ", error?.response ?? error);
      const errorMsg =
        (error?.response &&
          error.response.data &&
          error.response.data.message) ||
        error?.message ||
        "An error occurred";
      toast.error(`Staff fetch failed. ${errorMsg}`);
    },
    // While confirming actions we don't want aggressive refetches
    refetchOnWindowFocus: false,
    enabled: !!supervisorId,
  });

  const onClose = () => {
    navigate(location.pathname.replace(supervisorId, ""));
  };

  return (
    <main className="w-screen h-screen fixed top-0 left-0 bg-black/50 flex items-center justify-center z-50">
      <div className="p-5 rounded-xl bg-white w-[90%] max-w-100 m-auto space-y-5">
        {!isLoading && !isError && staff && (
          <>
            <section className="pb-4 relative  border-b rounded-t-xl flex flex-col gap-4">
              <div className="w-12 h-12 aspect-square z-1 rounded-full bg-gray-300"></div>

              <div className="mt-auto flex items-end justify-between">
                <div>
                  <h2 className="text-lg md:text-xl font-bold">
                    {staff.firstName} {staff.lastName}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500">
                    {staff.email}
                  </p>
                </div>

                <span className="py-1 px-3 rounded-3xl border border-dashed border-primary italic font-bold text-primary">
                  {staff.isAdmin ? "Admin" : "Supervisor"}
                </span>
              </div>

              <button
                type="button"
                title="Close dialog"
                onClick={() => onClose()}
                className="absolute top-0 right-0 h-fit aspect-square border rounded-full p-2 cursor-pointer hover:text-red-400 hover:border-red-400 hover:rotate-90 transition-all duration-300 ease-in-out"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </section>

            <div className="grid grid-cols-2 gap-2 rounded-lg">
              <div>
                <h2 className="text-sm md:text-sm font-bold">Faculty</h2>
                <p className="text-xs md:text-sm text-gray-400">
                  {staff.faculty}
                </p>
              </div>

              <div>
                <h2 className="text-sm md:text-base font-bold">Department</h2>
                <p className="text-xs md:text-sm text-gray-400">
                  {staff.department}
                </p>
              </div>
            </div>
          </>
        )}

        {isLoading && <Loader />}

        {isError && (
          <ErrorState
            title="Supervisor Error"
            description={error.message}
            onButtonClick={() => refetch()}
            showButton={true}
          />
        )}

        <div className="grid grid-cols-2 gap-2 rounded-lg">
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Total Inters</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                12
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Active Interns</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                25
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Completed Interns</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                25
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="h-fit flex items-center justify-end gap-4">
          <Button type="button" variant="outline">
            <Link to="edit">Edit</Link>
          </Button>
          <Button type="button" variant="destructive">
            <Link to="delete">Delete</Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default AdminStaffDetails;

const Loader = () => {
  return (
    <div className="animate-pulse">
      {/* Header Section */}
      <section className="pb-4 relative border-b rounded-t-xl flex flex-col gap-4">
        {/* Avatar Skeleton */}
        <div className="w-12 h-12 aspect-square rounded-full bg-gray-200"></div>

        <div className="mt-auto flex items-end justify-between">
          <div className="space-y-2">
            {/* Name Skeleton */}
            <div className="h-5 w-32 bg-gray-200 rounded"></div>
            {/* Email Skeleton */}
            <div className="h-3 w-48 bg-gray-200 rounded"></div>
          </div>

          {/* Badge Skeleton */}
          <div className="h-8 w-16 bg-gray-200 rounded-3xl"></div>
        </div>

        {/* Close Button Placeholder */}
        <div className="absolute top-0 right-0 h-10 w-10 bg-gray-100 rounded-full"></div>
      </section>

      {/* Grid Section */}
      <div className="grid grid-cols-2 gap-2 rounded-lg mt-4">
        <div className="space-y-2">
          {/* Faculty Label & Value */}
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
          <div className="h-3 w-28 bg-gray-100 rounded"></div>
        </div>

        <div className="space-y-2">
          {/* Department Label & Value */}
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-3 w-36 bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  );
};
