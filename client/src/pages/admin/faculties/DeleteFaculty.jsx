import { toast } from "sonner";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

import api from "@/api/api";

import Button from "@/components/ui/button";

const DeleteFaculty = () => {
  const [step, setStep] = useState(0);

  const navigate = useNavigate();
  const { facultyId } = useParams();

  const faculty = useQuery({
    queryKey: ["faculty", facultyId],
    queryFn: async () => {
      // api returns response.data via interceptor, so this resolves to the data object
      const data = await api.get(`/faculties/${facultyId}`);
      return data;
    },
    onError: (error) => {
      console.log("Faculty Error: ", error?.response || error);
      const errorMsg =
        (error?.response &&
          error.response.data &&
          error.response.data.message) ||
        error?.message ||
        "An error occurred";
      toast.error(`Faculty fetch failed. ${errorMsg}`);
    },
  });

  const mutation = useMutation({
    // No request body required for delete - backend expects DELETE /faculties/:id
    mutationFn: async () => {
      return await api.delete(`/faculties/${facultyId}`);
    },
    onSuccess: (data) => {
      // api interceptor returns the response data directly
      const message =
        (data && (data.message || data.msg)) || "Faculty deleted successfully";
      toast.success(message);
      setStep(1);
      // Redirect back to the parent route (faculty list) after a short delay to let user see the toast
      setTimeout(() => {
        navigate(location.pathname.replace("/delete", ""));
      }, 700);
    },
    onError: (error) => {
      console.error("Delete Error: ", error?.response || error);
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
    // Form submit simply triggers the delete mutation
    onSubmit: async () => {
      mutation.mutate();
    },
  });

  const onClose = () => {
    form.reset();
    navigate(location.pathname.replace("/delete", ""));
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
                  Delete Faculty
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
              {faculty.isLoading ? (
                "Loading faculty details..."
              ) : faculty.isError ? (
                "Unable to load faculty details."
              ) : (
                <>
                  Are you sure you want to delete{" "}
                  <strong>{faculty?.data?.name || "this faculty"}</strong>? This
                  action will delete the faculty as well as any departments
                  created by this faculty.{" "}
                  <strong>This action cannot be undone.</strong>
                </>
              )}
            </p>

            <div className="flex items-center justify-end gap-5">
              <Button
                type="button"
                className=""
                variant="outline"
                // disable while fetching the faculty or while delete is in progress
                disabled={faculty.isLoading || mutation.isLoading}
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
                    // disable while fetching the faculty or while delete is in progress
                    disabled={faculty.isLoading || mutation.isLoading}
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
                Faculty Deleted Successfully
              </h1>
              <p className="text-center">
                The faculty has been deleted successfully.
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
              Back to Faculty List
            </Button>
          </>
        )}
      </form>
    </main>
  );
};

export default DeleteFaculty;
