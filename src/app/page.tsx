import {
  GetLastReminders,
  GetMonthlyReminders,
  GetTodayReminders,
} from "@/actions/reminder";
import Title from "@/components/title";
import ReminderItem from "@/components/reminder-item";
import { Separator } from "@/components/ui/separator";

import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import Subtitle from "@/components/subtitle ";

import CompletedRemindersCard from "@/components/completed-reminders-card";
import { Reminder } from "@prisma/client";
import FrequencyItemsWrapper from "@/components/frequency-items-wrapper";
import ReminderItemsWrapper from "@/components/reminder-items-wrapper";

const Home = () => {
  function getFormattedDateWithDayOfWeek() {
    const currentDate = new Date();

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const formattedDate: string = currentDate.toLocaleDateString(
      "en-US",
      options,
    );

    return formattedDate;
  }

  const formattedDateWithDayOfWeek = getFormattedDateWithDayOfWeek();

  const DEFAULT_SKELETONS = new Array(3).fill(null);
  const DEFAULT_SKELETONS_FREQUENCY = new Array(5).fill(null);

  return (
    <main className="container w-full space-y-12 pb-10">
      <div className="flex flex-col gap-6">
        <Title>{formattedDateWithDayOfWeek}</Title>

        <Separator />

        <div className="flex flex-col gap-10 rounded p-4 lg:grid lg:grid-cols-3">
          <Suspense
            fallback={DEFAULT_SKELETONS.map((_, index) => (
              <SkeletonReminderItem key={index} />
            ))}
          >
            <ReminderItems />
          </Suspense>
        </div>

        <Separator />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-end gap-1">
          <Subtitle>Statistics</Subtitle>
          <span className="pb-0.5 text-xs text-muted-foreground">/ Month</span>
        </div>

        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-3">
          <Suspense
            fallback={DEFAULT_SKELETONS.map((_, index) => (
              <Skeleton
                className="h-full w-full lg:h-[250px] lg:w-[400px]"
                key={index}
              />
            ))}
          >
            <StatCardItems />
          </Suspense>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-end gap-1">
          <Subtitle>Frequency</Subtitle>
          <span className="pb-0.5 text-xs text-muted-foreground">
            / Last 5 days
          </span>
        </div>

        <div>
          <Suspense
            fallback={DEFAULT_SKELETONS_FREQUENCY.map((_, index) => (
              <Skeleton
                className="h-full w-full lg:h-[50px] lg:w-[50px]"
                key={index}
              />
            ))}
          >
            <FrequencyItems />
          </Suspense>
        </div>
      </div>
    </main>
  );
};

async function ReminderItems() {
  const reminders = await GetTodayReminders();

  if (!reminders || reminders?.length === 0) {
    return (
      <p className="text-muted-foreground">
        No reminders found yet. Create them.
      </p>
    );
  }

  return <ReminderItemsWrapper reminders={reminders} />;
}

function SkeletonReminderItem() {
  return (
    <div className="flex h-full w-full justify-between gap-10">
      <div className="flex w-full gap-3">
        <Skeleton className="h-5 w-5" />

        <div className="flex w-full flex-col gap-4 lg:w-[450px]">
          <Skeleton className="h-4" />
          <Skeleton className="h-3" />
        </div>
      </div>

      <Skeleton className="h-5 w-5" />
    </div>
  );
}

async function StatCardItems() {
  const todayReminders = await GetTodayReminders();
  const monthlyReminders = await GetMonthlyReminders();

  function calculatePercentage(reminders: Reminder[] | undefined) {
    if (!reminders || reminders.length === 0) return;

    const completedReminders = reminders.filter(
      ({ completed }) => completed === true,
    );

    const completedRemindersPercentage =
      (completedReminders.length / reminders.length) * 100;

    return {
      percentage: completedRemindersPercentage,
      completed: completedReminders.length,
      total: reminders.length,
    };
  }

  const getTodayPercentage = calculatePercentage(todayReminders);
  const getMonthlyPercentage = calculatePercentage(monthlyReminders);

  return (
    <>
      <CompletedRemindersCard
        completedRemindersStats={getTodayPercentage}
        title="Today"
        description="Today's percentage"
      />

      <CompletedRemindersCard
        completedRemindersStats={getMonthlyPercentage}
        title="Monthly"
        description="Percentage this month."
      />
    </>
  );
}

async function FrequencyItems() {
  const reminders = await GetLastReminders();

  if (!reminders || reminders.length === 0) {
    return null;
  }

  const remindersByDay: Record<string, Reminder[]> = {};

  reminders.forEach((reminder) => {
    const date = reminder?.initialDeadline || reminder?.deadline;
    const reminderDate = new Date(date!);

    const formattedDate = new Date(
      reminderDate.getFullYear(),
      reminderDate.getMonth(),
      reminderDate.getDate(),
    )
      .toISOString()
      .split("T")[0]; // Use only the date part

    if (!remindersByDay[formattedDate]) {
      remindersByDay[formattedDate] = [];
    }

    remindersByDay[formattedDate].push(reminder);
  });

  const sortedReminders = Object.entries(remindersByDay)
    .sort(
      ([dateA], [dateB]) =>
        new Date(dateA).getTime() - new Date(dateB).getTime(),
    )
    .map(([day, dayReminders]) => {
      const completedReminders = dayReminders.filter(
        ({ completed }) => completed,
      );

      const percentage =
        (completedReminders.length / dayReminders.length) * 100;

      return {
        day,
        percentage: percentage.toFixed(2),
        completedReminders: completedReminders.length,
        totalReminders: dayReminders.length,
        reminders: dayReminders,
      };
    });

  return <FrequencyItemsWrapper reminders={sortedReminders} />;
}

export default Home;
