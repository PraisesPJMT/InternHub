import { Icon } from "@iconify/react";
import AppLink from "../AppLink";

const InternshipCard = ({ internship }) => {
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
          <Icon icon="lets-icons:date-fill" width="24" height="24" />

          <span>
            {internship?.startDate} - {internship?.endDate}
          </span>
        </p>
        <p className="text-gray-500 flex text-sm space-x-2">
          <Icon icon="mdi:location" width="24" height="24" />

          <span>{internship?.company}</span>
        </p>
        <AppLink to={internship?.id} className="w-full">
          View
        </AppLink>
      </div>
    </div>
  );
};

export default InternshipCard;
