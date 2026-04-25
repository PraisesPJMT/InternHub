import { useState } from "react";
import { Outlet } from "react-router";

import AdminHeader from "@/components/admin/general/AdminHeader";
import AdminSidebar from "@/components/admin/general/AdminSidebar";

const AdminDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="h-screen w-screen bg-primary flex flex-col ocerflow-hidden md:grid md:grid-cols-[60px_1fr] lg:grid-cols-[250px_1fr]">
        <AdminSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div className="grow grid grid-rows-[60px_1fr] overflow-hidden">
          <AdminHeader setMenuOpen={setMenuOpen} />
          <div className="w-full h-full p-2 md:p-4 lg:p-6 md:rounded-tl-2xl flex flex-col overflow-hidden bg-white">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
