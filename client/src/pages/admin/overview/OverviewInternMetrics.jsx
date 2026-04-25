import MetricCard from "@/components/general/MetricCard";
import SemiDonutChart from "@/components/general/SemiDonutChart";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const fetchMetrics = async () => {
  // mock API for intern metric with 2 sec delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { total: 60, active: 15, completed: 45 };
};

const OverviewInternMetrics = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["supervisor-intern-metrics"],
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

  const completed = data?.completed ?? 0;
  const total = data?.total ?? 0;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="flex flex-col gap-2">
      <h2>Interns Summary</h2>
      <div className="grid grid-cols-2 gap-2 rounded-lg">
        <div className="grid grid-cols-2 gap-2 rounded-lg">
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
            type="orange"
          />

          <MetricCard
            isLoading={isLoading}
            isError={isError}
            value={data?.completed}
            title="Completed"
            type="green"
          />
        </div>

        <div>
          <SemiDonutChart
            isLoading={isLoading}
            isError={isError}
            value={percentage}
          />
        </div>
      </div>
    </section>
  );
};

export default OverviewInternMetrics;
