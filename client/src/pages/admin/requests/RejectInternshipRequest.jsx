import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import Button from "@/components/ui/button";
import { toast } from "sonner";

// --- MOCK API ---
const rejectRequestMock = async (id) => {
  await new Promise((res) => setTimeout(res, 2000));
  return { status: "rejected" };
};

const RejectInternshipRequest = () => {
  const [step, setStep] = useState(0);
  const { requestId } = useParams();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => rejectRequestMock(requestId),
    onSuccess: () => {
      toast.success("Request rejected successfully");
      setStep(1);
    },
    onError: (error) => {
      toast.error(error.message || "Reject failed");
    },
  });

  const onClose = () => {
    navigate(-1 || location.pathname.replace("/reject", ""));
  };

  return (
    <main className="overlay-style">
      <div className="modal-style">
        {step === 0 ? (
          <>
            <h1 className="text-red-600 text-2xl font-bold">
              Reject Internship Request
            </h1>
            <p>Are you sure you want to reject this request?</p>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => mutation.mutate()}>
                Reject
              </Button>
            </div>
          </>
        ) : (
          <h1 className="text-center text-primary font-bold">
            Request Rejected Successfully
          </h1>
        )}
      </div>
    </main>
  );
};

export default RejectInternshipRequest;
