import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import LoadingState from "@/components/general/LoadingState";
import ErrorState from "@/components/general/ErrorState";

const fetchFacultyMetrics = async () => {
  await new Promise((res) => setTimeout(res, 2000));
  return {
    totalFaculties: 10,
    totalDepartments: 35,
  };
};

const OverviewFacultyMetricsSection = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["faculty-metrics"],
    queryFn: fetchFacultyMetrics,
  });

  return (
    <section className="mb-6 grid grid-cols-2 gap-4">
      {isLoading ? (
        <LoadingState message="Loading faculty metrics..." />
      ) : isError ? (
        <ErrorState
          title="Failed to load faculty metrics"
          description={error?.message || ""}
          onButtonClick={refetch}
        />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardDescription>Total Faculties</CardDescription>
              <CardTitle>{data.totalFaculties}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Total Departments</CardDescription>
              <CardTitle>{data.totalDepartments}</CardTitle>
            </CardHeader>
          </Card>
        </>
      )}
    </section>
  );
};

export default OverviewFacultyMetricsSection;