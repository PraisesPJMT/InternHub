import AppLink from "@/components/ui/AppLink";
import Button from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Link, Outlet } from "react-router";
import StudentInternshipList from "./sections/StudentInternshipList";
import StudentDetailsSection from "./sections/StudentDetailsSection";

const AdminStudentDetails = () => {
  return (
    <div className="flex flex-col gap-5 p-1 overflow-y-auto">
      <StudentDetailsSection />

      <StudentInternshipList />
      <Outlet />
    </div>
  );
};

export default AdminStudentDetails;
