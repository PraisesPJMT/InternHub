import Button from "@/components/ui/button";
import { Link, Outlet } from "react-router";
import StaffList from "./staff/sections/StaffLists";
import StudentMetrics from "./students/sections/StudentMetrics";
import StudentList from "./students/sections/StudentList";

const AdminStudents = () => {
  return (
    <div className="flex flex-col gap-5 p-1 overflow-hidden">
      <section className="p-5 border-b rounded-t-xl flex items-center justify-between gap-2">
        <h2 className="text-xl md:text-2xl font-bold">Students</h2>

        <Button type="button">
          <Link to="new">Add Student</Link>
        </Button>
      </section>

      <StudentMetrics />

      <div className="flex flex-col overflow-y-auto">
        <StudentList />
      </div>
    </div>
  );
};

export default AdminStudents;
