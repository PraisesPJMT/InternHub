import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const InternsMetrics = () => {
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-lg">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Interns</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            267
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Interns</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            25
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Inctive Interns</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            25
          </CardTitle>
        </CardHeader>
      </Card>
    </section>
  );
};

export default InternsMetrics;
