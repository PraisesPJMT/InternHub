import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "sonner";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Helper UI building blocks moved out of the render scope to avoid
 * recreating components on each render (prevents React warnings).
 *
 * These are intentionally simple presentational components so they can
 * be reused by the metrics component below.
 */
export const LoadingSquare = () => (
  // pulsating gray square (keeps the title visible)
  <div className="w-20 h-20 md:w-24 md:h-14 bg-gray-200 rounded animate-pulse" />
);

export const ErrorSquare = () => (
  // light red rectangle (not pulsating)
  <div className="w-20 h-20 md:w-24 md:h-14 bg-red-100 border border-red-200 rounded flex items-center justify-center">
    {/* keep empty interior; title remains visible above */}
  </div>
);

export const ValueSquare = ({ children }) => (
  <div className="w-20 h-20 md:w-24 md:h-14 bg-transparent flex items-center justify-center">
    <span className="text-2xl font-semibold tabular-nums">{children}</span>
  </div>
);

/**
 * Fetch metrics for all faculties from the backend.
 * Expected backend response shape (server/controller created):
 * { success: true, data: { totalFaculties: number, totalDepartments: number } }
 *
 * The api client used in this project typically unwraps response.data, but
 * we defensively normalize the returned shape here.
 */
const fetchFacultiesMetrics = async () => {
  const res = await api.get("/faculties/metrics");
  // res may be { success, data } (where data holds the metrics) or the data object directly
  const payload = res && res.success ? res.data : (res?.data ?? res ?? {});
  const metrics = payload?.data ?? payload ?? {};
  return metrics;
};

const FacultiesMetrics = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["facultiesMetrics"],
    queryFn: () => fetchFacultiesMetrics(),
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

  {
    /* Helper components are declared at module scope above to avoid recreating them on each render. */
  }

  return (
    <section className="grid grid-cols-2 gap-2 rounded-lg">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Faculties</CardDescription>

          {/* Value area */}
          {isLoading ? (
            <LoadingSquare />
          ) : isError ? (
            <ErrorSquare />
          ) : (
            <ValueSquare>{data?.totalFaculties ?? 0}</ValueSquare>
          )}
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Departments</CardDescription>

          {/* Value area */}
          {isLoading ? (
            <LoadingSquare />
          ) : isError ? (
            <ErrorSquare />
          ) : (
            <ValueSquare>{data?.totalDepartments ?? 0}</ValueSquare>
          )}
        </CardHeader>
      </Card>
    </section>
  );
};

export default FacultiesMetrics;
