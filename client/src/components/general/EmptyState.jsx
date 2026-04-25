import React from "react";
import { Icon } from "@iconify/react";

const EmptyState = ({
  icon = "ph:empty-fill",
  title = "No data found",
  description = "There are no items to display at the moment.",
  iconClassName = "w-16 h-16 md:w-20 md:h-20",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:py-16 md:py-20">
      <Icon
        icon={icon}
        className={`text-muted-foreground/40 mb-4 ${iconClassName}`}
      />
      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 text-center">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground text-center max-w-md">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;
