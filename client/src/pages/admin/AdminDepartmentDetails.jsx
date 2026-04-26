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

const AdminDepartmentDetails = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["department", departmentId],
    queryFn: async () => {
      const response = await api.get(`/departments/${departmentId}`);

      return response.data;
    },
    onError: (error) => {
      // console.log("Department Error: ", error.response);
      const errorMsg = error.response.data.message || "An error occurred";
      toast.error(`Department fetch failed. ${errorMsg}`);
    },
  });

  const onClose = () => {
    navigate(location.pathname.replace(departmentId, ""));
  };

  return (
    <main className="w-screen h-screen fixed top-0 left-0 bg-black/50 flex items-center justify-center z-50">
      <div className="p-5 rounded-xl bg-white w-[90%] max-w-100 m-auto space-y-5">
        {!isLoading && !isError && data && (
          <>
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-xl md:text-2xl font-bold text-primary">
                {data?.name}
              </h2>

              <button
                type="button"
                title="Close dialog"
                onClick={() => onClose()}
                className="h-fit aspect-square border rounded-full p-2 cursor-pointer hover:text-red-400 hover:border-red-400 hover:rotate-90 transition-all duration-300 ease-in-out"
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
            </div>

            <div className="flex items-end justify-between gap-2">
              <div className=" space-y-2">
                <div>
                  <h2 className="text-sm md:text-sm font-bold">
                    Department Code
                  </h2>
                  <p className="text-xs md:text-sm text-gray-400">
                    {data?.code}
                  </p>
                </div>

                <div>
                  <h2 className="text-sm md:text-base font-bold">
                    Department Description
                  </h2>
                  <p className="text-xs md:text-sm text-gray-400">
                    {data?.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-lg">
              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>Staff</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {data?.staffCount}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>Students</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {data?.studentCount}
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
          </>
        )}

        {isLoading && <DepartmentLoader />}

        {isError && (
          <ErrorState
            title="Department Error"
            description={
              error?.message ||
              "Something went wrong fetching department details. Please try again"
            }
            onButtonClick={refetch}
          />
        )}
      </div>
    </main>
  );
};

export default AdminDepartmentDetails;

const DepartmentLoader = () => {
  return (
    <div className="p-5 rounded-xl bg-white w-[90%] max-w-100 m-auto space-y-5 animate-pulse">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-2">
        <div className="h-8 w-48 bg-gray-200 rounded-md"></div> {/* Title */}
        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>{" "}
        {/* Close Button */}
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        {/* Code Block */}
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-3 w-12 bg-gray-100 rounded"></div>
        </div>

        {/* Description Block */}
        <div className="space-y-2">
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
          <div className="space-y-1">
            <div className="h-3 w-full bg-gray-100 rounded"></div>
            <div className="h-3 w-5/6 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 gap-2">
        {[1, 2].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="h-3 w-12 bg-gray-200 rounded"></div>
            <div className="h-8 w-10 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-end gap-4">
        <div className="h-10 w-20 bg-gray-200 rounded-md"></div>
        <div className="h-10 w-20 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
};
