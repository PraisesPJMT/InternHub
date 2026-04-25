import MetricCard from "@/components/general/MetricCard";
import SemiDonutChart from "@/components/general/SemiDonutChart";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const fetchMetrics = async () => {
  // mock API for intern metric with 2 sec delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { completed: 25, remaining: 158 };
};

const StudentInternMetric = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["student-intern-current-metrics"],
    queryFn: async () => fetchMetrics(),
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
  const remaining = data?.remaining ?? 0;
  const total = completed + remaining;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="flex flex-col gap-2">
      <h2>Current Internship</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-lg">
        <div className="grid grid-cols-2 gap-2 rounded-lg">
          <MetricCard
            isLoading={isLoading}
            isError={isError}
            value={total}
            title="Total logs"
          />

          <MetricCard
            isLoading={isLoading}
            isError={isError}
            value={completed}
            title="Completed logs"
            type="green"
          />

          <MetricCard
            isLoading={isLoading}
            isError={isError}
            value={remaining}
            title="Remaining Logs"
            type="orange"
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

export default StudentInternMetric;
