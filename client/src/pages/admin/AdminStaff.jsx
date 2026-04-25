import Button from "@/components/ui/button";
import { Link, Outlet } from "react-router";
import StaffMetrics from "./staff/sections/SatffMetrics";
import StaffList from "./staff/sections/StaffLists";

const AdminStaff = () => {
  return (
    <div className="flex flex-col gap-5 p-1 overflow-hidden">
      <section className="p-5 border-b rounded-t-xl flex items-center justify-between gap-2">
        <h2 className="text-xl md:text-2xl font-bold">Supervising Staff</h2>

        <Button type="button">
          <Link to="new">Onboard Staff</Link>
        </Button>
      </section>

      <StaffMetrics />

      <div className="flex flex-col overflow-y-auto">
        <StaffList />
      </div>

      <Outlet />
    </div>
  );
};

export default AdminStaff;
