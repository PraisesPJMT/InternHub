import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Button from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useParams } from "react-router";


const fetchLogs = () =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          { day: "Monday", date: "Jan 1, 2023", activity: "" },
          { day: "Tuesday", date: "Jan 2, 2023", activity: "" },
          { day: "Wednesday", date: "Jan 3, 2023", activity: "" },
          { day: "Thursday", date: "Jan 4, 2023", activity: "" },
          { day: "Friday", date: "Jan 5, 2023", activity: "" },
          { day: "Saturday", date: "Jan 6, 2023", activity: "" },
        ]),
      2000
    )
  );

export const WeeklyLogs = () => {
  const { internshipId, weekId } = useParams();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["weeklyLogs", internshipId, weekId],
    queryFn: fetchLogs,
  });

  if (isLoading)
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-[1fr_4fr] gap-2 md:gap-4 border rounded-lg p-3 animate-pulse"
          >
            <div className="space-y-1">
              <div className="h-5 w-20 bg-gray-300 rounded"></div>
              <div className="h-3 w-14 bg-gray-300 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-gray-300 rounded"></div>
              <div className="h-8 w-24 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );

  if (isError) return <p className="text-red-500">Failed to load logs</p>;

  return (
    <div className="space-y-4">
      {data?.map((log) => (
        <DailyLogForm key={log.day} log={log} />
      ))}
    </div>
  );
};

const DailyLogForm = ({ log }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activity, setActivity] = useState(log.activity);

  const mutation = useMutation({
    mutationFn: (newActivity) =>
      new Promise((resolve) => setTimeout(() => resolve(newActivity), 2000)),
    onSuccess: () => setIsEditing(false),
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_4fr] gap-2 md:gap-4 border rounded-lg p-3">
      <div>
        <h3 className="text-sm font-semibold">{log.day}</h3>
        <p className="text-xs text-gray-400">{log.date}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[4fr_1fr] gap-2 md:gap-4">
        <textarea
          className="border p-2 rounded w-full disabled:cursor-not-allowed disabled:opacity-60"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          disabled={!isEditing || mutation.isPending}
          placeholder="Enter your daily log..."
        />

        <div className="flex flex-col gap-2 relative">
          <div className="w-full aspect-video bg-gray-300 rounded-md"></div>
          {!isEditing ? (
            <Button
              type="button"
              className="w-fit absolute -top-5 right-0 z-10"
              onClick={() => setIsEditing(true)}
              // variant="outline"
              // disabled={mutation.isPending}
              // loading={mutation.isPending}
            >
              <Icon icon="iconamoon:edit-fill" width="24" height="24" />
              Edit
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={() => mutation.mutate(activity)}
              loading={mutation.isPending}
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};