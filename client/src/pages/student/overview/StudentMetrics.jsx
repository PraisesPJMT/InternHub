import MetricCard from "@/components/general/MetricCard";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const fetchMetrics = async () => {
  // mock API for intern metric with 2 sec delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { total: 1, active: 1, pending: 0, rejected: 0 };
};

const StudentMetrics = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["student-intern-metrics"],
    queryFn: async () => fetchMetrics(),
    // do not refetch on window focus aggressively for metrics
    refetchOnWindowFocus: false,
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load metrics";
      toast.error(msg);
    },
  });
  return (
    <section className="flex flex-col gap-2">
      <h2>Internships</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-lg">
        <MetricCard
          isLoading={isLoading}
          isError={isError}
          value={data?.total}
          title="Total"
        />
  
        <MetricCard
          isLoading={isLoading}
          isError={isError}
          value={data?.active}
          title="Active"
          type="green"
        />
  
        <MetricCard
          isLoading={isLoading}
          isError={isError}
          value={data?.pending}
          title="Pending"
          type="orange"
        />
  
        <MetricCard
          isLoading={isLoading}
          isError={isError}
          value={data?.rejected}
          title="Rejected"
          type="red"
        />
      </div>
    </section>
  );
};

export default StudentMetrics;
