import { useSelector } from "react-redux";
import SupervisorPersonalInfoSection from "./profile/SupervisorPersonalInfoSection";
import SupervisorSecuritySection from "./profile/SupervisorSecuritySection";
import PersonalInfoSection from "./profile/SupervisorWorkSection";

const SupervisorProfile = () => {
  const { user } = useSelector((state) => state.authStore);
  return (
    <div className="flex flex-col gap-5 overflow-hidden">
      <section className="p-5 relative h-[250px] md:h-[350px] border-b rounded-t-xl flex flex-col">
        <div className="mt-auto flex items-end justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-bold">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-xs md:text-sm text-gray-500">{user?.email}</p>
          </div>

          <span className="py-1 px-3 rounded-3xl border border-dashed border-primary italic font-bold text-primary">
            {user?.role === "student"
              ? "Student"
              : user?.isSupervisor
                ? "Supervisor"
                : "Supervisor"}
          </span>
        </div>

        <div className="h-[30%] aspect-square z-1 rounded-full bg-gray-300 absolute top-[50%] translate-y-[-60%] flex items-center justify-center">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="User Avatar"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-400 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user?.firstName?.charAt(0) + user?.lastName?.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="w-full h-1/2 bg-linear-to-br rom-transparent from-40% to-primary to-90% absolute top-0 left-0 rounded-t-xl"></div>
      </section>

      <section className="flex flex-col gap-5 overflow-y-auto">
        <SupervisorPersonalInfoSection />

        <hr className="border-t border-gray-300" />

        <PersonalInfoSection />

        <hr className="border-t border-gray-300" />

        <SupervisorSecuritySection />
      </section>
    </div>
  );
};

export default SupervisorProfile;
