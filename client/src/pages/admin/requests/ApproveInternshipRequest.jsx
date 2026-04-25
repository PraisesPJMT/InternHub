import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import Button from "@/components/ui/button";
import { toast } from "sonner";

// --- MOCK API ---
const approveRequestMock = async (id) => {
  await new Promise((res) => setTimeout(res, 2000));
  return { status: "approved" };
};

const ApproveInternshipRequest = () => {
  const [step, setStep] = useState(0);
  const { requestId } = useParams();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => approveRequestMock(requestId),
    onSuccess: () => {
      toast.success("Request approved successfully");
      setStep(1);
    },
    onError: (error) => {
      toast.error(error.message || "Approve failed");
    },
  });

  const onClose = () => {
    navigate(-1 || location.pathname.replace(requestId + "/approve", ""));
  };

  return (
    <main className="overlay-style">
      <div className="modal-style">
        {step === 0 ? (
          <>
            <h1 className="text-green-600 text-2xl font-bold">
              Approve Internship Request
            </h1>
            <p>Are you sure you want to approve this request?</p>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => mutation.mutate()}
              >
                Approve
              </Button>
            </div>
          </>
        ) : (
          <h1 className="text-center text-primary font-bold">
            Request Approved Successfully
          </h1>
        )}
      </div>
    </main>
  );
};

export default ApproveInternshipRequest;