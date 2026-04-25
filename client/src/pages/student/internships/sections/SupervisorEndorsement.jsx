import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

const fetchEndorsement = () =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          name: "John Doe",
          email: "john.doe@example.com",
          date: "Jan 1, 2023",
          avatar: "",
          endorsement:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio, sed cursus elit, sed facilisis nunc. Praesent dapibus, massa at interdum ullamcorper, sapien justo cursus urna, vitae vulputate lorem ipsum sit amet elit. Cras mattis consectetur purus sit amet fermentum, et posuere erat varius at.",
        }),
      2000,
    ),
  );

export const SupervisorEndorsement = () => {
  const { internshipId, weekId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["endorsement", internshipId, weekId],
    queryFn: fetchEndorsement,
  });

  if (isLoading)
    return (
      <div className="p-4 border rounded-lg animate-pulse space-y-2">
        <div className="h-4 w-32 bg-gray-300 rounded"></div>
        <div className="h-4 w-64 bg-gray-300 rounded"></div>
        <div className="h-20 bg-gray-300 rounded"></div>
      </div>
    );

  if (isError)
    return <p className="text-red-500">Failed to load endorsement</p>;

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Endorsements</h3>
        <p className="text-sm text-gray-500">{data.endorsement}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-2 space-y-1">
          <h5 className="text-sm italic font-semibold">Supervisor Signature</h5>
          <div className="h-20 aspect-video bg-gray-300 rounded-md"></div>
        </div>
        <div className="p-2 space-y-1 flex items-center gap-2">
          <div className="h-10 w-10 bg-gray-400 rounded-full"></div>
          <div className="flex flex-col">
            <p className="text-sm font-medium">{data.name}</p>
            <p className="text-xs text-gray-500">{data.email}</p>
          </div>
        </div>
        <div className="p-2 space-y-1">
          <h5 className="text-sm italic font-semibold">Endorsement Date</h5>
          <p className="text-xs text-gray-500">{data.date}</p>
        </div>
      </div>
    </div>
  );
};
