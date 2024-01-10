import { Reminder } from "@prisma/client";
import { format, parse } from "date-fns";
import { Check, X } from "lucide-react";
import { ReminderType } from "./reminder-form";

const SheetItem = ({
  id,
  deadline,
  initialDeadline,
  time,
  title,
  description,
  completed,
  type,
}: Reminder) => {
  const SELECTED_START_DATE =
    initialDeadline && format(initialDeadline, "LLL dd");

  const SELECTED_END_DATE = deadline && format(deadline, "LLL dd");

  const SELECTED_TIME =
    time && format(parse(time, "HH:mm", new Date()), "HH:mm");

  let TEXT_COLOR;

  switch (type) {
    case ReminderType.Another:
      TEXT_COLOR = "text-primary";
      break;
    case ReminderType.Goal:
      TEXT_COLOR = "text-primary";
      break;
    case ReminderType.Routine:
      TEXT_COLOR = "text-primary";
      break;
    case ReminderType.Task:
      TEXT_COLOR = "text-red-400";
      break;
    case ReminderType.Urgent:
      TEXT_COLOR = "text-red-500";
      break;
    default:
      TEXT_COLOR = "";
  }

  return (
    <div key={id} className="flex flex-col">
      <div className="flex justify-between">
        <div className="space-y-1">
          <h1 className="font-geist_mono uppercase lg:text-xl">{title}</h1>
          <p className="line-clamp-3 text-white/90">{description}</p>
        </div>

        {completed ? <Check /> : <X />}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <p className="font-geist_mono text-xs text-muted-foreground">
          {deadline
            ? `${SELECTED_START_DATE} - ${SELECTED_END_DATE}, at ${SELECTED_TIME}.`
            : `${SELECTED_START_DATE}, at ${SELECTED_TIME}.`}
        </p>

        <span className={`${TEXT_COLOR}`}>{type}</span>
      </div>
    </div>
  );
};

export default SheetItem;
