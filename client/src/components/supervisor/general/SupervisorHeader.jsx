import { Link } from "react-router";
import { Icon } from "@iconify/react";
import { useAuth } from "@/hooks/useAuth";
import { useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Button from "@/components/ui/button";

const SupervisorHeader = ({ setMenuOpen }) => {
  const { user } = useSelector((state) => state.authStore);

  const { logout } = useAuth();
  return (
    <header className="px-2 py-2 h-full w-full flex items-center gap-5">
      <button
        type="button"
        title="Open Menu"
        className="flex items-center justify-center md:hidden p-2 rounded-md text-white cursor-pointer"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <Icon icon="material-symbols:menu-rounded" width="24" height="24" />
      </button>

      <span className="py-2 px-4 text-sm md:text-base rounded text-white font-bold italic">
        Supervisor Dashboard
      </span>

      <div className="ml-auto flex items-center gap-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="">
            <Button
              variant="outline"
              className="p-1! md:py-1 md:pl-1! md:pr-3 flex items-center gap-2 rounded-4xl"
            >
              <span className="h-full aspect-square bg-primary rounded-full text-white text-xs font-black flex items-center justify-center">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </span>

              <span className="text-sm hidden md:flex">
                {user?.firstName} {user?.lastName}
              </span>

              <Icon
                icon="fluent:chevron-down-12-filled"
                className="hidden md:flex"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <div className="px-4 py-2 flex flex-col items-center justify-center gap-2">
                <span className="h-10 w-10 aspect-square bg-primary rounded-full text-white text-xs font-black flex items-center justify-center">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </span>

                <span className="text-sm">
                  {user?.firstName} {user?.lastName}
                </span>

                <span className="text-xs text-primary italic">
                  {user?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="mb-2 hover:bg-primary/50 hover:text-primary cursor-pointer">
              <Link
                to="/admin/profile"
                className="flex items-center gap-2 px-3"
              >
                <span>
                  <Icon icon="iconamoon:profile-fill" />
                </span>
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="bg-red-200 text-red-600 hover:bg-red-300 hover:text-red-700 cursor-pointer">
              <button
                type="button"
                className="flex items-center gap-2 px-3"
                onClick={logout}
              >
                <Icon icon="uis:signout" width="24" height="24" />
                Sign out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default SupervisorHeader;
