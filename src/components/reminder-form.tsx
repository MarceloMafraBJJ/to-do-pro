"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import DateAndTimePickerWithRange, {
  DateAndTimeProps,
} from "./date-and-time-picker-with-range";
import { Label } from "./ui/label";
import { useState } from "react";
import { toast } from "sonner";
import {
  CreateReminder,
  DeleteReminder,
  UpdateReminder,
} from "@/actions/reminder";
import { useUser } from "@clerk/nextjs";
import LoadingSpinner from "./LoadingSpinner";
import { useRouter } from "next/navigation";
import { Reminder } from "@prisma/client";
import { FormatDate, FormatTime } from "@/lib/format-date";

const formSchema = z.object({
  title: z.string().min(2).optional().or(z.literal("")),
  description: z.string().min(2).max(250),
  type: z.string().optional().or(z.literal("")),
  completed: z.boolean().default(false),
  initialDeadline: z.date().nullish(),
  deadline: z.date().nullish(),
  time: z.string(),
});

type ReminderFormProps = React.ComponentProps<"form"> & {
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  reminder?: Reminder;
};

export enum ReminderType {
  Urgent = "urgent",
  Task = "task",
  Routine = "routine",
  Goal = "goal",
  Another = "another",
}

const ReminderForm = ({
  className,
  setOpenDialog,
  reminder,
}: ReminderFormProps) => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: reminder?.title || "",
      description: reminder?.description,
      completed: reminder?.completed,
      time: reminder?.time || "",
      initialDeadline: reminder?.initialDeadline,
      deadline: reminder?.deadline,
    },
  });

  const isEditing = !!reminder;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || error) return;

    let reminderData = {
      ...values,
      type: "",
      userId: user?.id,
    };

    try {
      setIsLoading(true);

      if (isEditing) {
        await UpdateReminder({ reminderData, reminderId: reminder.id });
        toast.success("The reminder was updated successfully.");
      } else {
        if (!form.getValues("type")) {
          return form.setError("type", { message: "Type is required." });
        }

        reminderData.type = form.getValues("type") as string;

        await CreateReminder({ reminderData });

        toast.success("The reminder was created successfully.");
      }

      router.refresh();
      return setOpenDialog(false);
    } catch (error) {
      toast.error("The reminder cannot be created.");
    } finally {
      setIsLoading(false);
    }
  }

  async function HandleDeleteReminder() {
    if (!reminder) return;

    try {
      setIsLoading(true);

      await DeleteReminder({ reminderId: reminder?.id });
      toast.error("The reminder was deleted successfully.");

      router.refresh();
      return setOpenDialog(false);
    } catch (error) {
      toast.error("The reminder cannot be deleted.");
    } finally {
      setIsLoading(false);
    }
  }

  function setDateEndTimeStates(date: DateAndTimeProps) {
    const hasDateAndTime = (date.from || date.to) && date.time;

    if (hasDateAndTime) {
      setError(false);
      setStateIfDateExists({ date });
    } else {
      toast.error("You must select a date for the reminder.");
      return setError(true);
    }
  }

  function setStateIfDateExists({ date }: { date: DateAndTimeProps }) {
    verifyIfDateAndTimeExists(date).initialDate
      ? form.setValue(
          "initialDeadline",
          verifyIfDateAndTimeExists(date).initialDate,
        )
      : form.setValue("initialDeadline", null);

    verifyIfDateAndTimeExists(date).finalDate
      ? form.setValue("deadline", verifyIfDateAndTimeExists(date).finalDate)
      : form.setValue("deadline", null);

    form.setValue("time", verifyIfDateAndTimeExists(date).time);
  }

  function verifyIfDateAndTimeExists(date?: DateAndTimeProps) {
    const initialDate = date?.from || form.watch("initialDeadline");
    const finalDate = date?.to || form.watch("deadline");
    const time = date?.time || form.watch("time");

    const hasDateAndTime = (initialDate || finalDate) && time;

    return {
      exists: !!hasDateAndTime,
      initialDate,
      finalDate,
      time,
    };
  }

  const START_DATE = reminder && FormatDate(reminder?.initialDeadline);

  const END_DATE = reminder && FormatDate(reminder?.deadline);

  const TIME = reminder && FormatTime(reminder?.time);

  const EDIT_CALENDAR_PLACEHOLDER =
    reminder?.initialDeadline &&
    (reminder?.deadline
      ? `${START_DATE} - ${END_DATE}, at ${TIME}.`
      : `${START_DATE}, at ${TIME}.`);

  const dateAndTimeData = {
    from: reminder?.initialDeadline
      ? new Date(reminder?.initialDeadline)
      : null,
    to: reminder?.deadline ? new Date(reminder?.deadline) : null,
    time: reminder?.time!,
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-6", className)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Training at 8pm" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="I mustn't forget.." {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={reminder?.type || "Select a type"}
                    />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Types</SelectLabel>

                      {Object.keys(ReminderType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {ReminderType[type as keyof typeof ReminderType]}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-4">
          <Label className={`${error && "text-destructive"}`}>Date</Label>

          <DateAndTimePickerWithRange
            setDate={(date) => setDateEndTimeStates(date)}
            placeholder={EDIT_CALENDAR_PLACEHOLDER}
            date={dateAndTimeData as DateAndTimeProps}
          />

          {error && (
            <span className="text-sm font-medium text-destructive">
              Date and time is required.
            </span>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          onClick={() => {
            verifyIfDateAndTimeExists().exists ? null : setError(true);
          }}
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner /> : isEditing ? "Edit" : "Create"}
        </Button>

        {isEditing && (
          <div className="flex w-full justify-end">
            <Button
              variant={"ghost"}
              size={"sm"}
              onClick={HandleDeleteReminder}
              type="button"
            >
              Delete reminder
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default ReminderForm;
