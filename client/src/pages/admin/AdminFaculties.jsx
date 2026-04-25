import FacultiesList from "./faculties/sections/FacultiesList";
import FacultiesMetrics from "./faculties/sections/FacultiesMetrics";
import Button from "@/components/ui/button";
import CreateFaculty from "./faculties/CreateFaculty";
import { Link, Outlet } from "react-router";

const AdminFaculties = () => {
  return (
    <div className="flex flex-col gap-5 p-1 overflow-hidden">
      <section className="p-5 border-b rounded-t-xl flex items-center justify-between gap-2">
        <h2 className="text-xl md:text-2xl font-bold">Faculties</h2>

        <Button type="button">
          <Link to="new">Create</Link>
        </Button>
      </section>

      <FacultiesMetrics />

      <div className="flex flex-col overflow-y-auto">
        <FacultiesList />
      </div>

      <Outlet />
    </div>
  );
};

export default AdminFaculties;
