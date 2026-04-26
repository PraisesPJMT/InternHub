import { toast } from "sonner";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useForm } from "@tanstack/react-form";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";

import api from "@/api/api";

import Button from "@/components/ui/button";

const DeleteInternship = () => {
  const [step, setStep] = useState(0);

  const navigate = useNavigate();
  const { internshipId } = useParams();

  const { data: internship, isLoading } = useQuery({
    queryKey: ["internship", internshipId],
    queryFn: async () => {
      const response = await api.get(`/internships/${internshipId}`);
      return response?.data ?? response;
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/internships/${internshipId}`);
      return response;
    },
    onSuccess: (response) => {
      const message =
        response?.message || response?.msg || "Internship deleted successfully";
      toast.success(message);
      setStep(1);
    },
    onError: (error) => {
      // console.log("Delete Error: ", error?.response || error);
      const errorMsg =
        error?.response?.data?.message || error?.message || "An error occurred";
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
    onSubmit: async () => {
      mutation.mutate();
    },
  });

  const onClose = () => {
    form.reset();
    navigate(location.pathname.replace(internshipId + "/delete", ""));
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
                  Delete Internship
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
              Are you sure you want to delete{" "}
              <strong>
                {internship?.internship?.title || "this internship"}
              </strong>
              ?
              <br />
              <br />
              This action will delete the internship permanently and will affect
              all interns that have been enrolled in this internship.
              <br />
              <br />
              <strong>This action cannot be undone.</strong>
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
                    disabled={isLoading || mutation.isPending}
                    loading={mutation.isPending}
                  >
                    Delete
                  </Button>
                )}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <h1 className="text-primary text-3xl font-bold text-center">
                Internship Deleted Successfully
              </h1>
              <p className="text-center">
                The internship has been deleted successfully.
              </p>
            </div>

            <div className="my-10 flex items-center justify-center text-green-500">
              <Icon icon="icon-park-solid:success" className="w-30 h-30" />
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={() => navigate(location.pathname.replace("/delete", ""))}
            >
              Back to Internship List
            </Button>
          </>
        )}
      </form>
    </main>
  );
};

export default DeleteInternship;
