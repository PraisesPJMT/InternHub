import { Icon } from "@iconify/react";
import AppLink from "../AppLink";

const AdminInternshipCard = ({ internship }) => {
  return (
    <div className="p-4 border rounded-lg flex flex-col gap-1">
      <div className="aspect-video text-gray-500 flex items-center justify-center">
        <Icon
          icon="streamline-ultimate:work-from-home-user-sofa-bold"
          width="80%"
          height="80%"
        />
      </div>

      <div className="space-y-1">
        <p className="text-gray-900 flex text-base font-semibold">
          {internship?.title}
        </p>
        <p className="text-gray-500 flex text-sm space-x-2">
          <Icon icon="material-symbols:qr-code-rounded" width="24" height="24" />

          <b>Code: </b>
          <span>{internship?.code}</span>
        </p>
        <p className="text-gray-500 flex text-sm space-x-2">
          <Icon icon="mdi:calendar" width="24" height="24" />
          <b>Duration: </b>

          <span>{internship?.weeks} Weeks</span>
        </p>

        <div className="flex items-center gap-2">
          <div className="grow">
            <AppLink to={internship?.id} className="w-full">
              View
            </AppLink>
          </div>

          <AppLink
            title="Edit Internship"
            to={internship?.id + "/edit"}
            className="w-fit"
            variant="outline"
          >
            <Icon icon="iconamoon:edit-duotone" width="24" height="24" />
          </AppLink>

          <AppLink
            title="Delete Internship"
            to={internship?.id + "/delete"}
            className="w-fit"
            variant="destructive"
          >
            <Icon icon="material-symbols:delete" width="24" height="24" />
          </AppLink>
        </div>
      </div>
    </div>
  );
};

export default AdminInternshipCard;
