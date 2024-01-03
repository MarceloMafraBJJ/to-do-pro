import { Reminder } from "@prisma/client";
import { Button } from "./ui/button";
import { SheetTrigger } from "./ui/sheet";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import SheetItem from "./sheet-item";
import Title from "./title";

interface FrequencyItemProps {
  day: string;
  percentage: string;
  completedReminders: number;
  totalReminders: number;
  reminders: Reminder[];
}

const FrequencyItem = ({
  completedReminders,
  day,
  percentage: stringPercentage,
  totalReminders,
  reminders,
}: FrequencyItemProps) => {
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  }).format(new Date(day));

  const percentage = Number(stringPercentage);

  let backgroundColor = "";

  switch (true) {
    case percentage <= 25:
      backgroundColor = "bg-primary/25";
      break;
    case percentage <= 50:
      backgroundColor = "bg-primary/50";
      break;
    case percentage <= 75:
      backgroundColor = "bg-primary/75";
      break;
    case percentage <= 100:
      backgroundColor = "bg-primary/100";
      break;
    default:
      backgroundColor = "";
  }

  function calculatePercentage(reminders: Reminder[] | undefined) {
    if (!reminders || reminders.length === 0) return;

    const completedReminders = reminders.filter(
      ({ completed }) => completed === true,
    );

    const completedRemindersPercentage =
      (completedReminders.length / reminders.length) * 100;

    return {
      percentage: completedRemindersPercentage,
    };
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <h4 className="scroll-m-20 font-geist_mono text-xl font-semibold tracking-tight">
        {weekday}
      </h4>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            key={day}
            variant={"ghost"}
            className={`flex h-[50px] w-[50px] items-center justify-center ${backgroundColor}`}
          >
            <span className="font-geist_mono text-xs font-bold text-muted-foreground">
              {`${completedReminders}/${totalReminders}`}
            </span>
          </Button>
        </SheetTrigger>

        <SheetContent>
          <SheetHeader className="mt-2 items-start">
            <SheetTitle>{weekday}</SheetTitle>
            <SheetDescription className="text-start">
              You can see all reminders right here.
            </SheetDescription>
          </SheetHeader>
          <Separator className="my-4" />
          <div className="my-8 flex flex-col gap-10">
            {reminders.map((reminder) => {
              return <SheetItem key={reminder.id} {...reminder} />;
            })}
          </div>
          <Separator className="my-4" />

          <div className="flex items-end gap-2">
            <Title>
              {calculatePercentage(reminders)?.percentage.toFixed(2) + "%"}
            </Title>
            <span>Completed.</span>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FrequencyItem;
