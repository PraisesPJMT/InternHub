import StudentInternshipListWeek from "./StudentInternshipListWeek";

const StudentInternshipDetails = () => {
  return (
    <section className="p-5 border space-y-4 rounded-lg">
      <h2 className="text-sm md:text-sm font-bold">
        Student Industrial Work Experience
      </h2>

      <div className="p-4 grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <h2 className="text-sm font-bold">Start Date</h2>
            <p className="text-sm text-gray-400">January 1, 2023</p>
          </div>

          <div>
            <h2 className="text-sm font-bold">End Date</h2>
            <p className="text-sm text-gray-400">July 31, 2023</p>
          </div>

          <div>
            <h2 className="text-sm font-bold">Internship Place</h2>
            <p className="text-sm text-gray-400">JP Morgan</p>
          </div>

          <div>
            <h2 className="text-sm font-bold">Internship Location</h2>
            <p className="text-sm text-gray-400">New York, USA</p>
          </div>
        </div>

        {/* Supervisors */}
        <div className="space-y-3">
          <div className="border p-3 space-y-1 rounded-lg">
            <h5 className="text-sm italic font-semibold">
              Industry Supervisor
            </h5>
            <div className="flex items-center gap-4">
              <div className="bg-gray-400 w-10 h-10 rounded-full"></div>

              <div className="flex flex-col">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-500">john.doe@example.com</p>
              </div>
            </div>
          </div>

          <div className="border p-3 space-y-1 rounded-lg">
            <h5 className="text-sm italic font-semibold">
              Institute Supervisor
            </h5>
            <div className="flex items-center gap-4">
              <div className="bg-gray-400 w-10 h-10 rounded-full"></div>

              <div className="flex flex-col">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-500">john.doe@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      <StudentInternshipListWeek />
    </section>
  );
};

export default StudentInternshipDetails;
