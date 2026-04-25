import InternDetailsSection from "./sections/InternDetailsSection";
import InternInternshipDetails from "./sections/InternInternshipDetails";
const SupervisorInternInternship = () => {
  return (
    <div className="flex flex-col gap-5 p-1 overflow-y-auto">
      <InternDetailsSection />
      <InternInternshipDetails/>
    </div>
  );
};

export default SupervisorInternInternship;
