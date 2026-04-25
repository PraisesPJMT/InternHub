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

const AdminDepartmentDetails = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();

  const department = useQuery({
    queryKey: ["department", departmentId],
    queryFn: async () => {
      const response = await api.get(`/faculties/department${departmentId}`);

      return response.data;
    },
    onError: (error) => {
      console.log("Department Error: ", error.response);
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
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-primary">
            Department of Science
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
              <h2 className="text-sm md:text-sm font-bold">Department Code</h2>
              <p className="text-xs md:text-sm text-gray-400">SCI</p>
            </div>

            <div>
              <h2 className="text-sm md:text-base font-bold">
                Department Description
              </h2>
              <p className="text-xs md:text-sm text-gray-400">
                The Faculty of Science is dedicated to advancing knowledge and
                understanding in the natural sciences, mathematics, and related
                fields.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-lg">
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Staff</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                12
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Students</CardDescription>
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

export default AdminDepartmentDetails;
