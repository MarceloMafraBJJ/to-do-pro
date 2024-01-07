import { Percent } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface CompletedRemindersCard {
  completedRemindersStats?: {
    percentage: number;
    completed: number;
    total: number;
  };
  title: string;
  description: string;
}

const CompletedRemindersCard = ({
  completedRemindersStats,
  title,
  description,
}: CompletedRemindersCard) => {
  if (!completedRemindersStats) return;
  const { percentage, completed, total } = completedRemindersStats;

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>

        <CardDescription>{`${completed} / ${total}`}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-end gap-2">
          <h1 className="font-geist_mono text-6xl font-medium">
            {Number(percentage).toFixed(2)}
          </h1>
          <Percent size={25} strokeWidth={"3"} />
        </div>
      </CardContent>

      {/*  <Separator />

      <CardFooter className="p-2 px-6">
        <Button variant={"ghost"}>See more</Button>
      </CardFooter> */}
    </Card>
  );
};

export default CompletedRemindersCard;
