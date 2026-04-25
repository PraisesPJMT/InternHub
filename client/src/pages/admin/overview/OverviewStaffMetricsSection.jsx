import api from "@/api/api";
import MetricCard from "@/components/general/MetricCard";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const fetchSupervisorsMetrics = async () => {
  const res = await api.get("/supervisors/metrics");
  const payload = res && res.success ? res.data : (res?.data ?? res ?? {});
  // Payload may be { admins, supervisors } or { data: { admins, supervisors } }
  const metrics = payload?.data ?? payload ?? {};
  return metrics;
};

const OverviewStaffMetricsSection = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["supervisorsMetrics"],
    queryFn: () => fetchSupervisorsMetrics(),
    refetchOnWindowFocus: false,
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load staff metrics";
      toast.error(msg);
    },
  });

  return (
    <section className="flex flex-col gap-2">
      <h2>Staff Summary</h2>
      <div className="grid grid-cols-2 gap-2 rounded-lg">
        <MetricCard
          isLoading={isLoading}
          isError={isError}
          value={data?.admins}
          title="Admin Staff"
        />

        <MetricCard
          isLoading={isLoading}
          isError={isError}
          value={data?.supervisors}
          title="Supervisors"
        />
      </div>
    </section>
  );
};

export default OverviewStaffMetricsSection;
