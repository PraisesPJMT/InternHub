import { useSelector } from "react-redux";
import OverviewActiveInternsList from "./overview/OverviewActiveInternsList";
import OverviewInternMetrics from "./overview/OverviewInternMetrics";
import OverviewStaffMetricsSection from "./overview/OverviewStaffMetricsSection";
import OverviewStudentMetrics from "./overview/OverviewStudentMetrics";

const AdminOverview = () => {
  const { user } = useSelector((state) => state.authStore);
  return (
    <div className="flex flex-col gap-6 p-4 overflow-y-auto">
      <section className="p-5 border-b rounded-t-xl flex items-center justify-between gap-2">
        <h2 className="text-xl md:text-2xl font-bold">
          Welcome back {user?.firstName} 👋
        </h2>
      </section>
      <OverviewStaffMetricsSection />

      <OverviewStudentMetrics />

      <OverviewInternMetrics />

      <OverviewActiveInternsList />
    </div>
  );
};

export default AdminOverview;
