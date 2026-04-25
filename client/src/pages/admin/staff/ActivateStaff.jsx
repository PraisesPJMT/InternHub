import { toast } from "sonner";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

import api from "@/api/api";

import Button from "@/components/ui/button";

const ActivateStaff = () => {
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
    // do not refetch on window focus while user is interacting with confirmation
    refetchOnWindowFocus: false,
    enabled: !!supervisorId,
  });

  const mutation = useMutation({
    // Activate supervisor by setting isActive = true via PUT
    mutationFn: async () => {
      const res = await api.put(`/supervisors/${supervisorId}`, {
        isActive: true,
      });
      return res;
    },
    onSuccess: (res) => {
      const payload = res?.data ?? res ?? {};
      const message = payload?.message || "Supervisor activated successfully";
      toast.success(message);
      // refresh staff list
      queryClient.invalidateQueries(["staff"]);
      setStep(1);
      // navigate back to the staff view/list after a short delay so toast is visible
      setTimeout(() => {
        navigate(location.pathname.replace("/activate", ""));
      }, 600);
    },
    onError: (error) => {
      console.error("Activate Error: ", error?.response ?? error);
      const errorMsg =
        (error?.response &&
          error.response.data &&
          error.response.data.message) ||
        error?.message ||
        "An error occurred";
      toast.error(`Activation failed. ${errorMsg}`);
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
    navigate(location.pathname.replace(supervisorId + "/activate", ""));
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
                <h1 className="text-primary text-xl md:text-2xl font-bold">
                  Activate Staff
                </h1>
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={mutation.isLoading || staff.isLoading}
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
              </Button>
            </div>

            <p className="text-gray-500">
              Are you sure you want to activate <strong>this staff</strong>?
              This action will activate the staff.
            </p>

            <div className="flex items-center justify-end gap-5">
              <Button
                type="button"
                className=""
                variant="outline"
                disabled={mutation.isPending}
                onClick={onClose}
                // loading={mutation.isPending}
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
                    {mutation.isLoading ? "Activating..." : "Activate"}
                  </Button>
                )}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <h1 className="text-primary text-3xl font-bold text-center">
                Staff Activated Successfully
              </h1>
              <p className="text-center">
                The staff has been activated successfully.
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

export default ActivateStaff;
