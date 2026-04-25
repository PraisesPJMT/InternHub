import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import ErrorState from "@/components/general/ErrorState";
import EmptyState from "@/components/general/EmptyState";
import LoadingState from "@/components/general/LoadingState";
import InternshipCard from "@/components/ui/internship/IntershipCard";

const InternshipList = () => {
  const { studentId } = useParams();

  // TanStack Query Integration
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["intern-internships", studentId],
    queryFn: () => {
      // Mock API call to fetch student internships
      return Promise.resolve([
        {
          id: "internship-01",
          title: "Student Industrial Work Experience I",
          company: "St James Memorial Hospital",
          startDate: "June 20206",
          endDate: "December 2027",
        },
        {
          id: "internship-02",
          title: "Student Industrial Work Experience II",
          company: "ABC Company",
          startDate: "January 2021",
          endDate: "June 2022",
        },
      ]);
    },
    // placeholderData: keepPreviousData,
  });
  return (
    <section className="space-y-4 rounded-lg">
    
      {!isLoading && !isError && data?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 rounded-lg">
          {data.map((internship) => (
            <InternshipCard key={internship.id} internship={internship} />
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
  );
};

export default InternshipList;
