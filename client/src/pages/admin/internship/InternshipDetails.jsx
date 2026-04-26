import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import api from "@/api/api";

import AppLink from "@/components/ui/AppLink";
import ErrorState from "@/components/general/ErrorState";

const InternshipDetails = () => {
  const { internshipId } = useParams();

  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["internship", internshipId],
    queryFn: async () => {
      const response = await api.get(`/internships/${internshipId}`);

      return response.data;
    },
  });

  const onClose = () => {
    navigate(location.pathname.replace(internshipId, ""));
  };

  return (
    <main className="w-screen h-screen fixed top-0 left-0 bg-black/50 flex items-center justify-center z-50">
      <div className="p-5 rounded-xl bg-white w-[90%] max-w-100 m-auto space-y-5">
        <div className="flex justify-between gap-4">
          <div>
            <h1 className="text-primary text-xl md:text-2xl font-bold">
              Internship Details
            </h1>
          </div>

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

        {!isLoading && !isError && (
          <>
            <div>
              <h2 className="text-sm md:text-sm font-bold">Title</h2>
              <p className="text-xs md:text-sm text-gray-400">
                {data?.internship?.title}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-lg">
              <div>
                <h2 className="text-sm md:text-sm font-bold">Code</h2>
                <p className="text-xs md:text-sm text-gray-400">
                  {data?.internship?.code}
                </p>
              </div>

              <div>
                <h2 className="text-sm md:text-base font-bold">Duration</h2>
                <p className="text-xs md:text-sm text-gray-400">
                  {data?.internship?.duration} Weeks
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-sm md:text-sm font-bold">Description</h2>
              <p className="text-xs md:text-sm text-gray-400">
                {data?.internship?.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-lg">
              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>Total Interns</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {data?.metrics?.totalApplications}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>Active Internships</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {data?.metrics?.totalAccepted}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>Rejected Internships</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {data?.metrics?.totalRejected}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>Pending Internships</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {data?.metrics?.totalPending}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            <div className="h-fit flex items-center justify-end gap-4">
              <AppLink to="edit">Edit</AppLink>

              <AppLink to="delete" variant="destructive">
                Delete
              </AppLink>
            </div>
          </>
        )}

        {isLoading && (
          <div className="space-y-5 animate-pulse">
            {/* Title */}
            <div className="space-y-2">
              <div className="w-20 h-3 bg-gray-300 rounded" />
              <div className="w-60 h-4 bg-gray-200 rounded" />
            </div>

            {/* Code + Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="w-16 h-3 bg-gray-300 rounded" />
                <div className="w-24 h-4 bg-gray-200 rounded" />
              </div>

              <div className="space-y-2">
                <div className="w-20 h-3 bg-gray-300 rounded" />
                <div className="w-20 h-4 bg-gray-200 rounded" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="w-24 h-3 bg-gray-300 rounded" />
              <div className="w-full h-3 bg-gray-200 rounded" />
              <div className="w-5/6 h-3 bg-gray-200 rounded" />
              <div className="w-4/6 h-3 bg-gray-200 rounded" />
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="p-5 border rounded-lg space-y-3">
                  <div className="w-24 h-3 bg-gray-300 rounded" />
                  <div className="w-12 h-6 bg-gray-200 rounded" />
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <div className="w-16 h-9 bg-gray-200 rounded" />
              <div className="w-20 h-9 bg-gray-200 rounded" />
            </div>
          </div>
        )}

        {isError && (
          <ErrorState
            title="Internship Detials Error"
            description={
              error?.message ||
              "An error occured while fetching internship details. Please try again later."
            }
            showButton={true}
            onButtonClick={refetch}
          />
        )}
      </div>
    </main>
  );
};
export default InternshipDetails;
