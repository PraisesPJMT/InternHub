import { Outlet } from "react-router";
import InternshipRequestList from "./requests/sections/InternshipRequestList";
import InternshipRequestMetrics from "./requests/sections/InternshipRequestMetrics";

const AdminRequests = () => {
  return (
    <div className="flex flex-col gap-5 p-1 overflow-hidden">
      <section className="p-5 border-b rounded-t-xl flex items-center justify-between gap-2">
        <h2 className="text-xl md:text-2xl font-bold">Internship Requests</h2>
      </section>

      <InternshipRequestMetrics />

      <div className="flex flex-col overflow-y-auto">
        <InternshipRequestList />
      </div>

      <Outlet />
    </div>
  );
};

export default AdminRequests;
