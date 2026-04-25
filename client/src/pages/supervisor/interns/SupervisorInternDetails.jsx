
import InternInternshipList from "./sections/InternInternshipList";
import InternDetailsSection from "./sections/InternDetailsSection";

const SupervisorInternDetails = () => {
  return (
    <div className="flex flex-col gap-5 p-1 overflow-y-auto">
      <InternDetailsSection />

      <InternInternshipList />
    </div>
  );
};

export default SupervisorInternDetails;
