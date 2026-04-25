import { toast } from "sonner";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

import api from "@/api/api";

import Button from "@/components/ui/button";

const DeleteStaff = () => {
  const [step, setStep] = useState(0);

  const navigate = useNavigate();
  const { supervisorId } = useParams();

  const staff = useQuery({
    queryKey: ["staff", supervisorId],
    queryFn: async () => {
      // Use the supervisors endpoint on the API
      // The api client in this project sometimes unwraps response.data
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
    // Delete supervisor by id
    mutationFn: async () => {
      // Call DELETE /supervisors/:id
      const res = await api.delete(`/supervisors/${supervisorId}`);
      return res;
    },
    onSuccess: (res) => {
      // Normalize shapes: api client may return the unwrapped data or the wrapped payload
      const payload = res?.data ?? res ?? {};
      const message = payload?.message || "Supervisor deleted successfully";
      toast.success(message);
      setStep(1);
      // Optionally navigate back to list after a short delay so the toast is visible
      setTimeout(() => {
        navigate(location.pathname.replace(`/${supervisorId}/delete`, ""));
      }, 600);
    },
    onError: (error) => {
      console.error("Delete staff error:", error?.response ?? error);
      const errorMsg =
        (error?.response &&
          error.response.data &&
          error.response.data.message) ||
        error?.message ||
        "An error occurred";
      toast.error(`Delete failed. ${errorMsg}`);
    },
  });

  const form = useForm({
    // defaultValues: {
    //   name: "",
    //   code: "",
    //   description: "",
    // },
    // validators: {
    //   onChange: facultySchema,
    // },
    onSubmit: async ({ value }) => {
      console.log("Value: ", value);
      mutation.mutate(value);
    },
  });

  const onClose = () => {
    form.reset();
    navigate(location.pathname.replace(supervisorId + "/delete", ""));
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
                  Delete Staff
                </h1>
              </div>

              <button
                type="button"
                title="Close dialog"
                onClick={() => onClose()}
                className="h-fit aspect-square border rounded-full p-2 cursor-pointer hover:text-red-400 hover:border-red-400 hover:rotate-90 transition-all duration-300 ease-in-out"
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
                  Are you sure you want to delete{" "}
                  <strong>
                    {staff?.data?.firstName
                      ? `${staff.data.firstName} ${staff?.data?.lastName ?? ""}`
                      : "this staff"}
                  </strong>
                  ? This action will delete the staff permanently and will
                  affect all interns that have been assigned to this staff.{" "}
                  <strong>This action cannot be undone.</strong>
                </>
              )}
            </p>

            <div className="flex items-center justify-end gap-5">
              <Button
                type="button"
                className=""
                variant="outline"
                onClick={onClose}
                disabled={mutation.isLoading || staff.isLoading}
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
                    {mutation.isLoading ? "Deleting..." : "Delete"}
                  </Button>
                )}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <h1 className="text-primary text-3xl font-bold text-center">
                Staff Deleted Successfully
              </h1>
              <p className="text-center">
                The staff has been deleted successfully.
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

export default DeleteStaff;
