import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/api/api";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * FacultyMetrics
 *
 * Fetches metrics for a single faculty from:
 * GET /faculties/:id/metrics
 *
 * Expected server response:
 * { success: true, data: { departments: number, staff: number, students: number } }
 *
 * States:
 * - ready: show values
 * - loading: show square gray pulsating boxes (titles remain)
 * - error: show light red rectangle (not pulsating) but keep title
 */

const LoadingSquare = () => (
  <div className="w-20 h-20 md:w-24 md:h-14 bg-gray-200 rounded animate-pulse" />
);

const ErrorRect = () => (
  <div className="w-20 h-20 md:w-24 md:h-14 bg-red-100 border border-red-200 rounded flex items-center justify-center" />
);

const ValueBox = ({ children }) => (
  <div className="w-20 h-20 md:w-24 md:h-14 bg-transparent flex items-center justify-center">
    <span className="text-2xl font-semibold tabular-nums">{children}</span>
  </div>
);

const fetchFacultyMetrics = async (facultyId) => {
  const res = await api.get(`/faculties/${facultyId}/metrics`);
  // api client may unwrap response.data already; normalize to get the metrics object
  const payload = res && res.success ? res.data : (res?.data ?? res ?? {});
  const metrics = payload?.data ?? payload ?? {};
  return metrics;
};

const FacultyMetrics = () => {
  const { facultyId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["facultyMetrics", facultyId],
    queryFn: () => fetchFacultyMetrics(facultyId),
    enabled: !!facultyId,
    refetchOnWindowFocus: false,
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load metrics";
      toast.error(msg);
    },
  });

  const departments = data?.departments ?? 0;
  const staff = data?.staff ?? 0;
  const students = data?.students ?? 0;

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-lg">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Departments</CardDescription>
          {isLoading ? (
            <LoadingSquare />
          ) : isError ? (
            <ErrorRect />
          ) : (
            <ValueBox>{departments}</ValueBox>
          )}
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Staff</CardDescription>
          {isLoading ? (
            <LoadingSquare />
          ) : isError ? (
            <ErrorRect />
          ) : (
            <ValueBox>{staff}</ValueBox>
          )}
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Students</CardDescription>
          {isLoading ? (
            <LoadingSquare />
          ) : isError ? (
            <ErrorRect />
          ) : (
            <ValueBox>{students}</ValueBox>
          )}
        </CardHeader>
      </Card>
    </section>
  );
};

export default FacultyMetrics;
