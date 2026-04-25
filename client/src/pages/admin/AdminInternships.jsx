import { useQuery } from "@tanstack/react-query";

import ErrorState from "@/components/general/ErrorState";
import EmptyState from "@/components/general/EmptyState";
import LoadingState from "@/components/general/LoadingState";
import InternshipCard from "@/components/ui/internship/IntershipCard";

import AppLink from "@/components/ui/AppLink";
import AdminInternshipCard from "@/components/ui/internship/AdminInternshipCard";
import { Outlet } from "react-router";

const AdminInternships = () => {
  // TanStack Query Integration
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["internships"],
    queryFn: () => {
      // Mock API call to fetch student internships
      return Promise.resolve([
        {
          id: "internship-01",
          title: "Student Industrial Work Experience I",
          code: "SIWES I",
          weeks: 12,
        },
        {
          id: "internship-02",
          title: "Student Industrial Work Experience II",
          code: "SIWES II",
          weeks: 52,
        },
      ]);
    },
    // placeholderData: keepPreviousData,
  });

  return (
    <>
      <div className="flex flex-col gap-5 p-1 overflow-hidden">
        <section className="p-5 border-b rounded-t-xl flex items-center justify-between gap-2">
          <h2 className="text-xl md:text-2xl font-bold">Faculties</h2>

          <AppLink to="new">Create</AppLink>
        </section>

        <section className="p-5 border space-y-4 rounded-lg overflow-y-auto">
          <h2 className="text-sm md:text-sm font-bold">Internships</h2>

          {!isLoading && !isError && data?.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 rounded-lg">
              {data.map((internship) => (
                <AdminInternshipCard
                  key={internship.id}
                  internship={internship}
                />
              ))}
            </div>
          )}

          {!isLoading && !isError && data?.length === 0 && (
            <EmptyState
              title="No Internships"
              description="Student is yet to start an internship."
            />
          )}

          {isLoading && <LoadingState />}

          {isError && (
            <ErrorState
              title="Internship Fetch Error"
              description={
                error?.message ||
                "An error occured while fetching internships. Please try again later."
              }
              showButton
              onButtonClick={refetch}
            />
          )}
        </section>
      </div>
      <Outlet />
    </>
  );
};

export default AdminInternships;
