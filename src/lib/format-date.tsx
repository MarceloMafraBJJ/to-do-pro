import { format, parse } from "date-fns";

function FormatDate(date: Date | null | undefined) {
  if (!date) return;

  return format(date, "LLL dd");
}

function FormatTime(time: string | null | undefined) {
  if (!time) return;

  return format(parse(time, "HH:mm", new Date()), "HH:mm");
}

export { FormatDate, FormatTime };
