"use client";

import { Reminder } from "@prisma/client";
import ReminderItem from "./reminder-item";
import { useEffect } from "react";
import { UpdateReminder } from "@/actions/reminder";
import { useRouter } from "next/navigation";

const ReminderItemsWrapper = ({ reminders }: { reminders: Reminder[] }) => {
  const router = useRouter();

  useEffect(() => {
    function handleResetReminder() {
      const currentDate = new Date().toDateString();
      const lastVisitDate = localStorage?.getItem("lastVisitDate");
      const isFirstVisit = !lastVisitDate || lastVisitDate !== currentDate;

      if (isFirstVisit) {
        localStorage.setItem("lastVisitDate", currentDate);

        return reminders.map(async (reminder) => {
          const reminderData = {
            completed: false,
          };

          await UpdateReminder({ reminderId: reminder.id, reminderData });
          return router.refresh();
        });
      }
    }

    handleResetReminder();
  }, []);

  return reminders?.map((reminder) => (
    <ReminderItem reminder={reminder} key={reminder.id} />
  ));
};

export default ReminderItemsWrapper;
