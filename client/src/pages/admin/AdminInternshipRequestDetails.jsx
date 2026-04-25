import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, Link } from "react-router";
import { Icon } from "@iconify/react";

import Button from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import LoadingState from "@/components/general/LoadingState";
import ErrorState from "@/components/general/ErrorState";

// --- MOCK API FUNCTION ---
const fetchInternshipRequest = async (id) => {
  await new Promise((res) => setTimeout(res, 2000)); // 2 sec delay
  return {
    id,
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@email.com",
    phone: "08012345678",
    department: "Computer Science",
    organisation: "TechCorp Ltd.",
    organisationAddress: "123 Tech Street, Lagos, Nigeria",
    internship: { 
      id: "1", 
      name: "Student Industrial Work Experience Scheme I", 
      code: "SIWES I" 
    },
    startDate: "2026-03-01T00:00:00Z",
    endDate: "2026-08-31T00:00:00Z",
    status: "pending",
    supervisor: {
      firstName: "Jane",
      lastName: "Smith",
      email: "janesmith@email.com",
      phone: "08087654321",
    },
  };
};

const AdminInternshipRequestDetails = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["internship-request", requestId],
    queryFn: () => fetchInternshipRequest(requestId),
    onError: (err) => toast.error(`Request fetch failed: ${err.message}`),
  });

  const onClose = () => {
    navigate(location.pathname.replace(requestId, ""));
  };

  if (isLoading) {
    return (
      <main className="w-screen h-screen fixed top-0 left-0 bg-black/50 flex items-center justify-center z-50">
        <LoadingState message="Loading internship request details..." />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="w-screen h-screen fixed top-0 left-0 bg-black/50 flex items-center justify-center z-50">
        <ErrorState
          title="Failed to load request"
          description={error?.message || "An error occurred while fetching the request."}
          onButtonClick={() => refetch()}
        />
      </main>
    );
  }

  return (
    <main className="w-screen h-screen fixed top-0 left-0 bg-black/50 flex items-center justify-center z-50">
      <div className="p-5 rounded-xl bg-white w-[95%] max-w-3xl m-auto space-y-6">
        {/* HEADER */}
        <section className="pb-4 relative border-b flex flex-col gap-4">
          <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center">
            <Icon icon="mdi:account" className="w-8 h-8 text-gray-600" />
          </div>

          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-xl font-bold">
                {data.firstName} {data.lastName}
              </h2>
              <p className="text-sm text-gray-500">{data.email}</p>
              <p className="text-sm text-gray-500">Phone: {data.phone}</p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs border capitalize">
              {data.status}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-0 right-0 border rounded-full p-2 hover:text-red-400 hover:border-red-400"
          >
            ✕
          </button>
        </section>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Department:</strong>
            <p>{data.department}</p>
          </div>

          <div>
            <strong>Internship:</strong>
            <p>{data.internship.name} ({data.internship.code})</p>
          </div>

          <div>
            <strong>Organisation:</strong>
            <p>{data.organisation}</p>
          </div>

          <div>
            <strong>Organisation Address:</strong>
            <p>{data.organisationAddress}</p>
          </div>

          <div>
            <strong>Start Date:</strong>
            <p>{new Date(data.startDate).toLocaleDateString()}</p>
          </div>

          <div>
            <strong>End Date:</strong>
            <p>{new Date(data.endDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* SUPERVISOR CARD */}
        <Card>
          <CardHeader>
            <CardDescription>Supervisor</CardDescription>
            <CardTitle>
              {data.supervisor.firstName} {data.supervisor.lastName}
            </CardTitle>
            <p className="text-sm text-gray-500">{data.supervisor.email}</p>
            <p className="text-sm text-gray-500">Phone: {data.supervisor.phone}</p>
          </CardHeader>
        </Card>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          {(data.status === "pending" || data.status === "rejected") && (
            <Button variant="outline">
              <Link to="approve">Approve</Link>
            </Button>
          )}

          {(data.status === "pending" || data.status === "approved") && (
            <Button variant="outline">
              <Link to="reject">Reject</Link>
            </Button>
          )}

          <Button variant="destructive">
            <Link to="delete">Delete</Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default AdminInternshipRequestDetails;