"use client";

import { Reminder } from "@prisma/client";
import { Checkbox } from "./ui/checkbox";
import { Edit } from "lucide-react";
import { UpdateReminder } from "@/actions/reminder";
import { useRouter } from "next/navigation";
import DrawerDialog from "./drawer-dialog";

const ReminderItem = ({ reminder }: { reminder: Reminder }) => {
  const router = useRouter();

  function handleCheckReminder() {
    try {
      const reminderData = {
        completed: !reminder.completed,
      };

      UpdateReminder({ reminderData, reminderId: reminder.id });
      router.refresh();
    } catch (error) {}
  }

  return (
    <div
      className={`flex justify-between gap-3 ${
        reminder.title ? "items-start" : "items-center"
      }`}
    >
      <div className="flex space-x-3">
        <Checkbox
          id={`term-${reminder.id}`}
          checked={reminder.completed}
          onClick={handleCheckReminder}
        />

        <div className="grid gap-1.5 leading-none">
          {reminder.title && (
            <label
              htmlFor={`term-${reminder.id}`}
              className={`cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                reminder.completed && "text-primary"
              }`}
            >
              {reminder.title}
            </label>
          )}

          <p
            className={`line-clamp-2 text-sm text-muted-foreground lg:line-clamp-4 ${
              reminder.completed && "line-through"
            }`}
          >
            {reminder.description}
          </p>
        </div>
      </div>

      <DrawerDialog alternativeIcon={Edit} reminder={reminder} />
    </div>
  );
};

export default ReminderItem;
