"use client";

import { ChangeEvent, Dispatch, HTMLAttributes, useState } from "react";
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export interface DateAndTimeProps extends DateRange {
  time: string;
}

const DateAndTimePickerWithRange = ({
  className,
  setDate,
}: {
  className?: HTMLAttributes<HTMLDivElement>;
  setDate: Dispatch<DateAndTimeProps>;
}) => {
  const currentDate = new Date();

  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>(
    format(currentDate, "HH:mm"),
  );

  let initialDate = selectedDate?.from;
  let finalDate = selectedDate?.to;

  let dateAndTimeData: DateAndTimeProps;

  const onSelectDate = (date: DateRange | undefined) => {
    setSelectedDate(date);

    dateAndTimeData = {
      time: selectedTime,
      from: date?.from,
      to: date?.to,
    };

    setDate(dateAndTimeData);
  };

  const onSelectTime = (date: ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(date.target.value);

    dateAndTimeData = {
      time: date.target.value,
      from: initialDate,
      to: finalDate,
    };

    setDate(dateAndTimeData);
  };

  const isDateDisabled = (date: Date) => {
    const currentDate = new Date();
    const oneDayBeforeCurrentDate = new Date(currentDate);
    oneDayBeforeCurrentDate.setDate(currentDate.getDate() - 1);
    return date < oneDayBeforeCurrentDate;
  };

  const timePicker = (
    <div className="my-4 flex flex-col gap-4">
      <Label>Time</Label>
      <Input type="time" onChange={onSelectTime} value={selectedTime} />
      <span className="text-xs text-muted-foreground">
        Select the end time for the reminder.
      </span>
    </div>
  );

  const SELECTED_START_DATE = initialDate && format(initialDate, "LLL dd");

  const SELECTED_END_DATE = finalDate && format(finalDate, "LLL dd");

  const SELECTED_TIME =
    selectedTime && format(parse(selectedTime, "HH:mm", new Date()), "HH:mm");

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {initialDate ? (
              finalDate ? (
                <p className="text-sm">
                  {`${SELECTED_START_DATE} - ${SELECTED_END_DATE}, at ${SELECTED_TIME}.`}
                </p>
              ) : (
                <p className="text-sm">
                  {`${SELECTED_START_DATE}, at ${SELECTED_TIME}.`}
                </p>
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Label className="break-words pb-12">
            Select a date to start and end the reminder.
          </Label>

          <Calendar
            mode="range"
            defaultMonth={selectedDate?.from}
            selected={selectedDate}
            onSelect={(date) => onSelectDate(date)}
            disabled={isDateDisabled}
            footer={timePicker}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateAndTimePickerWithRange;
