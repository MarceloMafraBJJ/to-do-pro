import useSWR from "swr";
import SwrFetcher from "@/lib/swr-fetcher";
import { GetTodayReminders } from "@/actions/reminder";
import { useEffect, useState } from "react";

const SliderMarquee = () => {
  const [upcomingReminders, setUpcomingReminders] = useState<
    string[] | undefined
  >([]);

  const { data, isLoading } = useSWR(
    "https://api.quotable.io/random",
    SwrFetcher,
  );

  const motivationalPhrase: string = !isLoading && data?.content;

  const currentDateTime: Date = new Date();

  useEffect(() => {
    async function GetUpcomingReminders() {
      const reminders = await GetTodayReminders();

      if (!reminders) return;

      // Filter reminders based on the time difference
      const upcomingReminders = reminders
        .filter((reminder) => {
          const [hours, minutes] = reminder.time!.split(":");
          const reminderTime: Date = new Date();
          reminderTime.setHours(parseInt(hours, 10));
          reminderTime.setMinutes(parseInt(minutes, 10));
          return reminderTime > currentDateTime;
        })
        .map((reminder) => {
          const [hours, minutes] = reminder.time!.split(":");
          const reminderTime: Date = new Date();
          reminderTime.setHours(parseInt(hours, 10));
          reminderTime.setMinutes(parseInt(minutes, 10));

          // Calculate time difference
          const timeDiff = reminderTime.getTime() - currentDateTime.getTime();
          const hoursDiff = timeDiff / (1000 * 60 * 60);
          const formattedDiff = formatTimeDifference(hoursDiff);

          return `${formattedDiff} to next reminder at: ${reminder.time}`;
        });

      setUpcomingReminders(upcomingReminders);
    }

    GetUpcomingReminders();
  }, []);

  function formatTimeDifference(hoursDiff: number) {
    const absoluteHours = Math.floor(Math.abs(hoursDiff));
    const absoluteMinutes = Math.floor((Math.abs(hoursDiff) * 60) % 60);

    const sign = hoursDiff >= 0 ? "" : "-";

    return `${sign}${absoluteHours}h${
      absoluteMinutes > 0 ? ` ${absoluteMinutes}min` : ""
    }`;
  }

  const arrayOfPhrasesAndReminders: string[] = [
    motivationalPhrase,
    ...(upcomingReminders || []),
  ];

  return (
    <div className="my-6 flex h-8 w-full items-center overflow-hidden bg-secondary shadow-lg">
      <div className="marquee flex gap-16 font-geist_mono text-xs uppercase md:text-sm">
        {arrayOfPhrasesAndReminders.map((item, index) => (
          <h1
            className={`${
              motivationalPhrase == item && "text-primary drop-shadow"
            }`}
            key={index}
          >
            {item}
          </h1>
        ))}
      </div>
    </div>
  );
};

export default SliderMarquee;
