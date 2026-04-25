import { toast } from "sonner";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import Button from "@/components/ui/button";

// --- MOCK API ---
const deleteRequestMock = async (id) => {
  await new Promise((res) => setTimeout(res, 2000));
  return { success: true };
};

const DeleteInternshipRequest = () => {
  const [step, setStep] = useState(0);
  const { requestId } = useParams();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => deleteRequestMock(requestId),
    onSuccess: () => {
      toast.success("Request deleted successfully");
      setStep(1);
    },
    onError: (error) => {
      toast.error(error.message || "Delete failed");
    },
  });

  const onClose = () => {
    navigate(-1 || location.pathname.replace("/delete", ""));
  };

  return (
    <main className="overlay-style">
      <div className="modal-style">
        {step === 0 ? (
          <>
            <h1 className="text-red-500 text-2xl font-bold">
              Delete Internship Request
            </h1>
            <p>This action cannot be undone.</p>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={() => mutation.mutate()}
                loading={mutation.isPending}
              >
                Delete
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-primary text-2xl font-bold text-center">
              Request Deleted Successfully
            </h1>
            <Button onClick={() => navigate("/admin/internship-requests")}>
              Back to List
            </Button>
          </>
        )}
      </div>
    </main>
  );
};

export default DeleteInternshipRequest;