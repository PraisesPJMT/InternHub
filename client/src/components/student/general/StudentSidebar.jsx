import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@iconify/react";
import { Link, NavLink } from "react-router";

const StudentSidebar = ({ menuOpen, setMenuOpen }) => {
  const { logout } = useAuth();

  const links = [
    {
      label: "Dashboard",
      icon: "ic:round-space-dashboard",
      path: "/",
      end: true,
    },
    {
      label: "Internships",
      icon: "streamline-ultimate:work-from-home-user-sofa-bold",
      path: "/internships",
      end: false,
    },
    {
      label: "Internligent",
      icon: "material-symbols:help-rounded",
      path: "/help",
      end: false,
    },
    {
      label: "Profile",
      icon: "iconamoon:profile-fill",
      path: "/profile",
      end: false,
    },
  ];

  return (
    <aside
      className={`w-screen h-screen md:w-full fixed top-0 ${menuOpen ? "left-0" : "-left-250"} md:static z-10 md:z-auto bg-accent md:bg-transparent transition-all duration-300 ease-in-out`}
    >
      <div className="h-full flex flex-col gap-5 relative">
        <div className="flex items-center justify-center p-4">
          <p className="flex items-center justify-center text-lg font-black text-foreground/80">
            <Icon
              icon="clarity:internet-of-things-solid"
              className="w-12 h-12 md:w-8 md:h-8 mr-4 md:mr-0 lg:mr-2 text-primary"
            />
            <span className="text-2xl text-primary lg:flex md:hidden">
              Intern
            </span>
            <span className="text-2xl lg:flex md:hidden">Hub</span>
          </p>
        </div>

        <button
          type="button"
          title="Open Menu"
          className="absolute top-4 right-4 flex items-center justify-center md:hidden p-2 rounded-md text-primary cursor-pointer"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <Icon icon="iconamoon:close-bold" width="24" height="24" />
        </button>

        <div className="h-full p-6 md:p-1 lg:p-3 flex flex-col gap-5">
          <nav className="space-y-4">
            {links.map((link) => (
              <NavLink
                key={link.label}
                to={link.path}
                end={link.end}
                title={link.label}
                className={({ isActive }) =>
                  `flex items-center justify-center lg:justify-start gap-2 py-1 px-2 md:py-2 lg:px-3 rounded-lg lg:rounded-l-none lg:border-l-5 ${isActive ? "lg:border-l-primary bg-primary/10 text-primary" : "lg:border-l-transparent bg-transparent text-foreground/50"} hover:bg-primary/10 hover:text-primary cursor-pointer lg:hover:border-l-primary`
                }
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
            className="mt-auto flex items-center justify-center lg:justify-start gap-2 py-1 px-2 md:py-2 lg:px-3 rounded-lg lg:rounded-l-none lg:border-l-5 lg:border-l-transparent bg-red-10 text-red-500 hover:bg-red-200 hover:text-red-700 cursor-pointer lg:hover:border-l-red-500"
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

export default StudentSidebar;
