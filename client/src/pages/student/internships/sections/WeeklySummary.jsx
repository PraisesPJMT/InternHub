import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Button from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useParams } from "react-router";

const fetchSummary = () =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio, sed cursus elit, sed facilisis nunc. Praesent dapibus, massa at interdum ullamcorper, sapien justo cursus urna, vitae vulputate lorem ipsum sit amet elit. Cras mattis consectetur purus sit amet fermentum, et posuere erat varius at.",
        ),
      2000,
    ),
  );

export const WeeklySummary = () => {
  const { internshipId, weekId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["weeklySummary", internshipId, weekId],
    queryFn: fetchSummary,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [summary, setSummary] = useState(data || "");

  const mutation = useMutation({
    mutationFn: (newText) =>
      new Promise((resolve) => setTimeout(() => resolve(newText), 2000)),
    onSuccess: () => setIsEditing(false),
  });

  if (isLoading)
    return (
      <div className="p-4 border rounded-lg animate-pulse">
        <div className="h-6 w-1/2 bg-gray-300 rounded mb-2"></div>
        <div className="h-20 bg-gray-300 rounded"></div>
        <div className="h-8 w-20 bg-gray-300 rounded mt-2"></div>
      </div>
    );

  if (isError) return <p className="text-red-500">Failed to load summary</p>;

  return (
    <div className="p-4 border rounded-lg space-y-2  relative">
      <h3 className="text-sm font-semibold">Weekly Summary</h3>
      <textarea
        className="border p-2 rounded w-full disabled:cursor-not-allowed disabled:opacity-60"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        disabled={!isEditing || mutation.isLoading}
        placeholder="Enter weekly summary..."
        rows={5}
      />
      <div className="flex gap-2">
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
          <>
            <Button
              disabled={mutation.isPending}
              onClick={() => {
                setSummary(data);
                setIsEditing(false)
              }}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => mutation.mutate(summary)}
              loading={mutation.isPending}
            >
              Submit
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
