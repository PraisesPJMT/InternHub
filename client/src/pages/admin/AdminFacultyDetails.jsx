import Button from "@/components/ui/button";
import CreateFaculty from "./faculties/CreateFaculty";
import FacultyMetrics from "./faculties/sections/FacultyMetrics";
import DepartmentList from "./faculties/sections/DepartmentList";
import { Outlet } from "react-router";
import FacultyDetails from "./faculties/sections/FacultyDetails";

const AdminFacultyDetails = () => {
  return (
    <div className="flex flex-col gap-5 p-1 overflow-hidden">
      <FacultyDetails />

      <div className="flex flex-col overflow-y-auto">
        <FacultyMetrics />

        <DepartmentList />
      </div>

      <Outlet />
    </div>
  );
};

export default AdminFacultyDetails;
