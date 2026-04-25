import React from "react";
import { Icon } from "@iconify/react";

const LoadingState = ({
  icon = "line-md:loading-twotone-loop",
  message = "Loading...",
  iconClassName = "w-12 h-12 md:w-16 md:h-16",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:py-16 md:py-20">
      <Icon
        icon={icon}
        className={`text-primary mb-4 ${iconClassName}`}
      />
      <p className="text-sm sm:text-base text-muted-foreground text-center">
        {message}
      </p>
    </div>
  );
};

export default LoadingState;