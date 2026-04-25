import { toast } from "sonner";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import AppLink from "@/components/ui/AppLink";

const InternDetailsSection = () => {
  const { studentId } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["intern-details", studentId],
    queryFn: async () => {
      // Proper async mock
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (!studentId) {
            reject(new Error("Invalid student ID"));
          }

          resolve({
            id: studentId,
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@email.com",
            faculty: "Faculty of Science",
            department: "Computer Science",
          });
        }, 1000);
      });
    },
    onError: (err) => {
      toast.error(`Student fetch failed. ${err.message}`);
    },
  });

  // --------------------
  // Loading State
  // --------------------
  if (isLoading) {
    return (
      <section className="flex flex-col gap-5 animate-pulse">
        <div className="p-5 border-b rounded-t-xl flex flex-col gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-300" />

          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="w-32 h-4 bg-gray-300 rounded" />
              <div className="w-48 h-3 bg-gray-200 rounded" />
            </div>

            <div className="flex gap-3">
              <div className="w-16 h-8 bg-gray-200 rounded" />
              <div className="w-16 h-8 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        <div className="p-5 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="w-24 h-3 bg-gray-300 rounded" />
            <div className="w-32 h-3 bg-gray-200 rounded" />
          </div>

          <div className="space-y-2">
            <div className="w-24 h-3 bg-gray-300 rounded" />
            <div className="w-32 h-3 bg-gray-200 rounded" />
          </div>
        </div>
      </section>
    );
  }

  // --------------------
  // Error State
  // --------------------
  if (isError) {
    return (
      <section className="p-6 border rounded-xl text-center space-y-4">
        <p className="text-red-500 font-medium">
          Failed to load student details.
        </p>

        <p className="text-sm text-gray-500">
          {error?.message || "Something went wrong."}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-black text-white rounded-md"
        >
          Retry
        </button>
      </section>
    );
  }

  // --------------------
  // Success State
  // --------------------
  return (
    <section className="flex flex-col gap-5">
      <div className="p-5 border-b rounded-t-xl flex gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-300" />

        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-bold">
              {data.firstName} {data.lastName}
            </h2>
            <p className="text-xs md:text-sm text-gray-500">{data.email}</p>
          </div>
        </div>
      </div>

      <div className="p-5 grid grid-cols-2 gap-2 rounded-lg">
        <div>
          <h2 className="text-sm font-bold">Faculty</h2>
          <p className="text-sm text-gray-400">{data.faculty}</p>
        </div>

        <div>
          <h2 className="text-sm font-bold">Department</h2>
          <p className="text-sm text-gray-400">
            Department of {data.department}
          </p>
        </div>
      </div>
    </section>
  );
};

export default InternDetailsSection;
