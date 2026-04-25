import InternsList from "./interns/sections/InternsList";
import InternsMetrics from "./interns/sections/InternsMetrics";

const AdminInterns = () => {
  return (
    <div className="flex flex-col gap-5 p-1 overflow-hidden">
      <section className="p-5 border-b rounded-t-xl flex items-center justify-between gap-2">
        <h2 className="text-xl md:text-2xl font-bold">Interns</h2>
      </section>

      <InternsMetrics />

      <div className="flex flex-col overflow-y-auto">
        <InternsList />
      </div>
    </div>
  );
};

export default AdminInterns;
