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
 * Small presentational blocks declared at module scope so they aren't
 * recreated on every render (avoids React warnings).
 */
const LoadingSquare = () => (
  <div className="w-20 h-10 md:w-24 md:h-14 bg-gray-200 rounded animate-pulse" />
);

const ErrorRect = () => (
  <div className="w-20 h-10 md:w-24 md:h-14 bg-red-100 border border-red-200 rounded flex items-center justify-center" />
);

const ValueSquare = ({ children }) => (
  <div className="w-20 h-10 md:w-24 md:h-14 bg-transparent flex items-center justify-center">
    <span className="text-2xl font-semibold tabular-nums">{children}</span>
  </div>
);

/**
 * Fetch metrics for supervisors from backend.
 * Endpoint: GET /supervisors/metrics
 * Server response shape (expected):
 * { success: true, data: { admins: number, supervisors: number } }
 *
 * The project's api client sometimes unwraps response.data; we normalize both shapes.
 */
const fetchSupervisorsMetrics = async () => {
  const res = await api.get("/supervisors/metrics");
  const payload = res && res.success ? res.data : (res?.data ?? res ?? {});
  // Payload may be { admins, supervisors } or { data: { admins, supervisors } }
  const metrics = payload?.data ?? payload ?? {};
  return metrics;
};

const StaffMetrics = () => {
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

  const admins = data?.admins ?? 0;
  const supervisors = data?.supervisors ?? 0;

  return (
    <section className="grid grid-cols-2 gap-2 rounded-lg">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Admins</CardDescription>

          {isLoading ? (
            <LoadingSquare />
          ) : isError ? (
            <ErrorRect />
          ) : (
            <ValueSquare>{admins}</ValueSquare>
          )}
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Supervisors</CardDescription>

          {isLoading ? (
            <LoadingSquare />
          ) : isError ? (
            <ErrorRect />
          ) : (
            <ValueSquare>{supervisors}</ValueSquare>
          )}
        </CardHeader>
      </Card>
    </section>
  );
};

export default StaffMetrics;
