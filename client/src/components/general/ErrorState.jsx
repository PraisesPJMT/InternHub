import React from "react";
import { Icon } from "@iconify/react";
import Button from "@/components/ui/button";

const ErrorState = ({
  icon = "material-symbols:error-rounded",
  title = "Something went wrong",
  description = "We couldn't load the data. Please try again.",
  buttonLabel = "Refresh",
  onButtonClick,
  iconClassName = "w-16 h-16 md:w-20 md:h-20",
  showButton = true,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:py-16 md:py-20">
      <Icon
        icon={icon}
        className={`text-destructive/60 mb-4 ${iconClassName}`}
      />

      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 text-center">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground text-center max-w-md mb-6">
        {description}
      </p>
      {showButton && onButtonClick && (
        <Button onClick={onButtonClick} variant="outline" className="gap-2">
          <Icon icon="tabler:refresh" className="w-4 h-4" />
          {buttonLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
