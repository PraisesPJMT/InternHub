import InternshipList from "./internships/sections/InternshipList";

const StudentInternships = () => {
  return (
    <div className="flex flex-col gap-5 p-1 overflow-hidden">
      <section className="p-5 border-b rounded-t-xl flex items-center justify-between gap-2">
        <h2 className="text-xl md:text-2xl font-bold">Student Internships</h2>
      </section>

      <div className="flex flex-col overflow-y-auto">
        <InternshipList />
      </div>
    </div>
  );
};

export default StudentInternships;
