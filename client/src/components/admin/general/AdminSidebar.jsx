import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@iconify/react";
import { Link, NavLink } from "react-router";

const AdminSidebar = ({ menuOpen, setMenuOpen }) => {
  const { logout } = useAuth();

  const links = [
    {
      label: "Dashboard",
      icon: "ic:round-space-dashboard",
      path: "/admin",
      end: true,
    },
    {
      label: "Requests",
      icon: "fluent:branch-request-16-filled",
      path: "/admin/requests",
      end: false,
    },
    {
      label: "Students",
      icon: "mdi:account-student",
      path: "/admin/students",
      end: false,
    },
    {
      label: "Interns",
      icon: "streamline-ultimate:work-from-home-user-sofa-bold",
      path: "/admin/interns",
      end: false,
    },
    {
      label: "Staff",
      icon: "mdi:account-group",
      path: "/admin/staff",
      end: false,
    },
    {
      label: "Internships",
      icon: "streamline-ultimate:work-from-home-user-sofa-bold",
      path: "/admin/internships",
      end: false,
    },
    {
      label: "Faculties",
      icon: "material-symbols:help-rounded",
      path: "/admin/faculties",
      end: false,
    },
    {
      label: "Profile",
      icon: "iconamoon:profile-fill",
      path: "/admin/profile",
      end: false,
    },
  ];

  return (
    <aside
      className={`w-screen h-screen md:w-full fixed top-0 ${menuOpen ? "left-0" : "-left-250"} md:static z-10 md:z-auto bg-primary md:bg-transparent transition-all duration-300 ease-in-out`}
    >
      <div className="h-full flex flex-col gap-5 relative">
        <div className="flex items-center justify-center p-4">
          <p className="flex items-center justify-center text-lg font-black text-foreground/80">
            <Icon
              icon="clarity:internet-of-things-solid"
              className="w-12 h-12 md:w-8 md:h-8 mr-4 md:mr-0 lg:mr-2 text-white"
            />
            <span className="text-2xl text-white lg:flex md:hidden">
              Intern
            </span>
            <span className="text-2xl text-white/40 lg:flex md:hidden">
              Hub
            </span>
          </p>
        </div>

        <button
          type="button"
          title="Open Menu"
          className="absolute top-4 right-4 flex items-center justify-center md:hidden p-2 rounded-md text-white cursor-pointer"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <Icon icon="iconamoon:close-bold" width="24" height="24" />
        </button>

        <div className="h-full p-6 md:p-1 lg:p-3 lg:pr-0 flex flex-col gap-5">
          <nav className="space-y-4">
            {links.map((link) => (
              <NavLink
                key={link.label}
                to={link.path}
                end={link.end}
                title={link.label}
                className={({ isActive }) =>
                  `flex items-center justify-center lg:justify-start gap-2 py-1 px-2 md:py-2 lg:px-3 rounded-md lg:rounded-l-none lg:rounded-r-md lg:border-l-5 ${isActive ? "lg:border-l-primary/40 bg-white text-primary lg:rounded-r-none!" : "lg:border-l-transparent bg-white/10 text-white/80 lg:mr-2"} hover:bg-white hover:text-primary cursor-pointer lg:hover:border-l-primary/40`
                }
                md
                onClick={() => setMenuOpen(false)}
              >
                <Icon
                  icon={link.icon}
                  width="24"
                  height="24"
                  className="hidden md:flex"
                />
                <span className="flex md:hidden lg:flex">{link.label}</span>
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="mt-auto bg-red-200/50 flex items-center justify-center lg:justify-start gap-2 py-1 px-2 md:py-2 lg:px-3 rounded-lg lg:rounded-l-none lg:border-l-5 lg:border-l-transparent lg:mr-3 text-red-500 hover:bg-red-200 hover:text-red-700 cursor-pointer lg:hover:border-l-red-500"
            onClick={() => {
              logout();
              setMenuOpen(false);
            }}
            title="Sign out"
          >
            <Icon
              icon="uis:signout"
              width="24"
              height="24"
              className="hidden md:flex"
            />
            <span className="flex md:hidden lg:flex">Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
