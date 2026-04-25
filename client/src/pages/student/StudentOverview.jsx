import { useSelector } from "react-redux";
import StudentMetrics from "./overview/StudentMetrics";
import StudentInternMetric from "./overview/StudentInternMetric";
import StudentDashboardCalendar from "./overview/StudentDashboardCalendar";
import { Outlet } from "react-router";

const StudentOverview = () => {
  const { user } = useSelector((state) => state.authStore);
  return (
    <div className="flex flex-col gap-6 p-4 overflow-y-auto">
      <section className="p-5 border-b rounded-t-xl flex items-center justify-between gap-2">
        <h2 className="text-xl md:text-2xl font-bold">
          Welcome back {user?.firstName} 👋
        </h2>
      </section>

      <StudentMetrics />

      <StudentInternMetric />

      <StudentDashboardCalendar />

      <Outlet />
    </div>
  );
};

export default StudentOverview;
