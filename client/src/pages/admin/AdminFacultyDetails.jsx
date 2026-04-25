import Button from "@/components/ui/button";
import CreateFaculty from "./faculties/CreateFaculty";
import FacultyMetrics from "./faculties/sections/FacultyMetrics";
import DepartmentList from "./faculties/sections/DepartmentList";
import { Link, Outlet } from "react-router";

const AdminFacultyDetails = () => {
  return (
    <div className="flex flex-col gap-5 p-1 overflow-hidden">
      <section className="p-5 border-b rounded-t-xl flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl md:text-2xl font-bold">Faculty of Science</h2>

          <Button type="button">
            <Link to="new">Create Department</Link>
          </Button>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="w-1/2 space-y-2">
            <div>
              <h2 className="text-sm md:text-sm font-bold">Faculty Code</h2>
              <p className="text-xs md:text-sm text-gray-400">SCI</p>
            </div>

            <div>
              <h2 className="text-sm md:text-base font-bold">
                Faculty Description
              </h2>
              <p className="text-xs md:text-sm text-gray-400">
                The Faculty of Science is dedicated to advancing knowledge and
                understanding in the natural sciences, mathematics, and related
                fields.
              </p>
            </div>
          </div>

          <div className="h-fit flex items-center justify-end gap-4">
            <Button type="button" variant="outline">
              <Link to="edit">Edit</Link>
            </Button>
            <Button type="button" variant="destructive">
              <Link to="delete">Delete</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="flex flex-col overflow-y-auto">
        <FacultyMetrics />

        <DepartmentList />
      </div>

      <Outlet />
    </div>
  );
};

export default AdminFacultyDetails;
