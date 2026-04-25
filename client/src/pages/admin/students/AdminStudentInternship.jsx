import StudentDetailsSection from "./sections/StudentDetailsSection";
import StudentInternshipDetails from "./sections/StudentInternshipDetails";

const AdminStudentInternship = () => {
  return (
    <div className="flex flex-col gap-5 p-1 overflow-y-auto">
      <StudentDetailsSection />
      <StudentInternshipDetails/>
    </div>
  );
};

export default AdminStudentInternship;
