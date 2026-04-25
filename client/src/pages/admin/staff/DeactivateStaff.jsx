import { toast } from "sonner";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

import api from "@/api/api";

import Button from "@/components/ui/button";

const DeactivateStaff = () => {
  const [step, setStep] = useState(0);

  const navigate = useNavigate();
  const { supervisorId } = useParams();
  const queryClient = useQueryClient();

  const staff = useQuery({
    queryKey: ["staff", supervisorId],
    queryFn: async () => {
      // Use the supervisors endpoint and normalize shapes.
      const res = await api.get(`/supervisors/${supervisorId}`);
      return res?.data ?? res;
    },
    onError: (error) => {
      console.error("Staff fetch error: ", error?.response ?? error);
      const errorMsg =
        (error?.response &&
          error.response.data &&
          error.response.data.message) ||
        error?.message ||
        "An error occurred";
      toast.error(`Staff fetch failed. ${errorMsg}`);
    },
    // Do not refetch on window focus while confirming a destructive action
    refetchOnWindowFocus: false,
    enabled: !!supervisorId,
  });

  const mutation = useMutation({
    // Deactivate supervisor by setting isActive = false via PUT
    mutationFn: async () => {
      const res = await api.put(`/supervisors/${supervisorId}`, {
        isActive: false,
      });
      return res;
    },
    onSuccess: (res) => {
      const payload = res?.data ?? res ?? {};
      const message = payload?.message || "Supervisor deactivated successfully";
      toast.success(message);
      queryClient.invalidateQueries(["staff"]);
      setStep(1);
      // navigate back to the staff view/list after a short delay so toast is visible
      setTimeout(() => {
        navigate(location.pathname.replace("/deactivate", ""));
      }, 600);
    },
    onError: (error) => {
      console.error("Deactivate Error:", error?.response ?? error);
      const errorMsg =
        (error?.response &&
          error.response.data &&
          error.response.data.message) ||
        error?.message ||
        "An error occurred";
      toast.error(`Deactivation failed. ${errorMsg}`);
    },
  });

  const form = useForm({
    onSubmit: async () => {
      mutation.mutate();
    },
  });

  const onClose = () => {
    form.reset();
    navigate(location.pathname.replace(supervisorId + "/deactivate", ""));
  };

  return (
    <main className="w-screen h-screen fixed top-0 left-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="p-5 rounded-xl bg-white w-[90%] max-w-100 m-auto space-y-5"
      >
        {step < 1 ? (
          <>
            <div className="flex justify-between gap-4">
              <div>
                <h1 className="text-red-500 text-xl md:text-2xl font-bold">
                  Deactivate Staff
                </h1>
              </div>

              <button
                type="button"
                title="Close dialog"
                onClick={() => onClose()}
                className="h-fit aspect-square border rounded-full p-2 cursor-pointer hover:text-red-400 hover:border-red-400 hover:rotate-90 transition-all duration-300 ease-in-out"
                disabled={mutation.isLoading || staff.isLoading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <p className="text-gray-500">
              {staff.isLoading ? (
                "Loading staff details..."
              ) : staff.isError ? (
                "Unable to load staff details."
              ) : (
                <>
                  Are you sure you want to deactivate{" "}
                  <strong>
                    {staff?.data?.firstName
                      ? `${staff.data.firstName} ${staff?.data?.lastName ?? ""}`
                      : "this staff"}
                  </strong>
                  ? This action will deactivate the staff and will affect all
                  interns that have been assigned to this staff.
                </>
              )}
            </p>

            <div className="flex items-center justify-end gap-5">
              <Button
                type="button"
                className=""
                variant="outline"
                disabled={mutation.isLoading || staff.isLoading}
                onClick={onClose}
              >
                Close
              </Button>

              <form.Subscribe
                selector={(state) => state.isSubmitting}
                children={() => (
                  <Button
                    type="submit"
                    className=""
                    variant="destructive"
                    disabled={mutation.isLoading || staff.isLoading}
                    loading={mutation.isLoading}
                  >
                    {mutation.isLoading ? "Deactivating..." : "Deactivate"}
                  </Button>
                )}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <h1 className="text-primary text-3xl font-bold text-center">
                Staff Deactivated Successfully
              </h1>
              <p className="text-center">
                The staff has been deactivated successfully.
              </p>
            </div>

            <div className="my-10 flex items-center justify-center text-green-500">
              <Icon icon="icon-park-solid:success" className="w-30 h-30" />
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={() => navigate(location.pathname.replace("/edit", ""))}
            >
              Back to Staff List
            </Button>
          </>
        )}
      </form>
    </main>
  );
};

export default DeactivateStaff;
