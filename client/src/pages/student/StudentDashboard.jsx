import { useState } from "react";
import { Outlet } from "react-router";

import StudentHeader from "@/components/student/general/StudentHeader";
import StudentSidebar from "@/components/student/general/StudentSidebar";

const StudentDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <div className="h-screen w-screen flex flex-col ocerflow-hidden md:grid md:grid-cols-[60px_1fr] lg:grid-cols-[250px_1fr]">
        <StudentSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div className="grow grid grid-rows-[60px_1fr] overflow-hidden">
          <StudentHeader setMenuOpen={setMenuOpen} />
          <div className="w-full h-full p-2 md:p-4 lg:p-6 border-t md:border-l border-t-primary md:border-l-primary md:rounded-tl-2xl flex flex-col overflow-hidden bg-white">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
