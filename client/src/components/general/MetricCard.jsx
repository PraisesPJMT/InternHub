import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MetricCard = ({ isLoading, isError, value, title, type = "default" }) => {
  const VALUE_COLOR = {
    default: "text-card-foreground",
    green: "text-green-500",
    orange: "text-yellow-500",
    red: "text-red-500",
  };

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>

        {isLoading ? (
          <div className="w-20 h-10 md:w-24 md:h-10 bg-gray-200 rounded animate-pulse" />
        ) : isError ? (
          <div className="w-20 h-10 md:w-24 md:h-10 bg-red-100 border border-red-200 rounded flex items-center justify-center" />
        ) : (
          <div className="h-10 bg-transparent flex items-center">
            <span
              className={`text-2xl font-semibold tabular-nums ${VALUE_COLOR[type]}`}
            >
              {value}
            </span>
          </div>
        )}
      </CardHeader>
    </Card>
  );
};

export default MetricCard;
