import { toast } from "sonner";
import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import api from "@/api/api";
import Button from "@/components/ui/button";
import ErrorState from "@/components/general/ErrorState";

const fetchFaculty = async (facultyId) => {
  const res = await api.get(`/faculties/${facultyId}`);
  // api client may unwrap response.data already; normalize to get the metrics object
  const payload = res && res.success ? res.data : (res?.data ?? res ?? {});
  const response = payload?.data ?? payload ?? {};
  return response;
};

const FacultyDetails = () => {
  const { facultyId } = useParams();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["faculty", facultyId],
    queryFn: () => fetchFaculty(facultyId),
    enabled: !!facultyId,
    refetchOnWindowFocus: false,
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load metrics";
      toast.error(msg);
    },
  });

  if (isError)
    return (
      <ErrorState
        title="Faculty Error"
        description={
          error?.message ||
          "Something went wrong fetching faculty details. Please try again"
        }
        onButtonClick={refetch}
      />
    );

  if (isLoading) return <FacultyLoader />;

  return (
    <section className="p-5 border-b rounded-t-xl flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl md:text-2xl font-bold">{data?.name}</h2>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline">
            <Link to={location.origin + "/admin/faculties"}>Back</Link>
          </Button>
          <Button type="button">
            <Link to="new">Create Department</Link>
          </Button>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2">
        <div className="w-1/2 space-y-2">
          <div>
            <h2 className="text-sm md:text-sm font-bold">Faculty Code</h2>
            <p className="text-xs md:text-sm text-gray-400">{data?.code}</p>
          </div>

          <div>
            <h2 className="text-sm md:text-base font-bold">
              Faculty Description
            </h2>
            <p className="text-xs md:text-sm text-gray-400">
              {data?.description}
            </p>
          </div>
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
    </section>
  );
};

export default FacultyDetails;

const FacultyLoader = () => {
  return (
    <section className="p-5 border-b rounded-t-xl flex flex-col gap-4 animate-pulse">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        {/* Title Placeholder */}
        <div className="h-8 w-48 bg-gray-200 rounded-md"></div>

        {/* Create Button Placeholder */}
        <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
      </div>

      {/* Content Row */}
      <div className="flex items-end justify-between gap-2">
        <div className="w-1/2 space-y-4">
          {/* Faculty Code Section */}
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
            <div className="h-3 w-12 bg-gray-100 rounded"></div>
          </div>

          {/* Faculty Description Section */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="space-y-1">
              <div className="h-3 w-full bg-gray-100 rounded"></div>
              <div className="h-3 w-5/6 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons Placeholders */}
        <div className="h-fit flex items-center justify-end gap-4">
          <div className="h-9 w-16 bg-gray-200 rounded-md"></div>
          <div className="h-9 w-20 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </section>
  );
};
