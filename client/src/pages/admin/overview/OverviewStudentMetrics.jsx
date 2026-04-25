import MetricCard from "@/components/general/MetricCard";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const fetchMetrics = async () => {
  // mock API for intern metric with 2 sec delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { total: 60, active: 15, inactive: 45 };
};

const OverviewStudentMetrics = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-students-metrics"],
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
      <h2>Students Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-lg">
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
          value={data?.inactive}
          title="Inactive"
          type="orange"
        />
      </div>
    </section>
  );
};

export default OverviewStudentMetrics;
