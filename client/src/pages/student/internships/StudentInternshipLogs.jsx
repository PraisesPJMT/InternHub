import { SupervisorEndorsement } from "./sections/SupervisorEndorsement";
import { WeeklyLogs } from "./sections/WeeklyLogs";
import { WeeklySummary } from "./sections/WeeklySummary";

const StudentInternshipLogs = () => {
  return (
    <div className="flex flex-col gap-6 overflow-y-auto">
      <h2 className="text-xl md:text-2xl font-bold">
        Weekly Internship Logs
      </h2>
      <WeeklyLogs />
      <WeeklySummary />
      <SupervisorEndorsement />
    </div>
  );
};

export default StudentInternshipLogs;