"use server";

import { currentUser } from "@clerk/nextjs";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

async function CreateReminder({
  reminderData,
}: {
  reminderData: Prisma.ReminderCreateInput;
}) {
  try {
    const reminder = await prisma.reminder.create({
      data: { ...reminderData },
    });

    return reminder;
  } catch (error) {
    console.error("Something went wrong while creating reminder. ", error);
  }
}

async function UpdateReminder({
  reminderData,
  reminderId,
}: {
  reminderData: Prisma.ReminderUpdateInput;
  reminderId: string;
}) {
  const user = await currentUser();
  if (!user) throw new Error("User not found");

  try {
    const reminder = await prisma.reminder.update({
      data: { ...reminderData },
      where: { id: reminderId, userId: user.id },
    });

    return reminder;
  } catch (error) {
    console.error("Something went wrong while updating reminder. ", error);
  }
}

async function GetTodayReminders() {
  const user = await currentUser();
  if (!user) throw new Error("User not found");

  try {
    const currentDate = new Date();

    const isAfterMidnight =
      currentDate.getHours() === 0 &&
      currentDate.getMinutes() === 0 &&
      currentDate.getSeconds() === 0;

    const startOfCurrentDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    );

    if (isAfterMidnight) {
      await prisma.reminder.updateMany({
        where: {
          userId: user.id,
          initialDeadline: { lt: currentDate },
          deadline: { gt: currentDate },
        },
        data: {
          completed: false,
        },
      });
    }

    const reminders = await prisma.reminder.findMany({
      where: {
        userId: user.id,
        OR: [
          {
            initialDeadline: { lte: currentDate },
            deadline: { gte: currentDate },
          },
          { deadline: null },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    return reminders;
  } catch (error) {
    console.error(
      "Something went wrong while fetching or updating reminders. ",
      error,
    );
  }
}

async function GetMonthlyReminders() {
  const user = await currentUser();
  if (!user) throw new Error("User not found");

  try {
    const currentDate = new Date();

    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );

    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );

    const reminders = await prisma.reminder.findMany({
      where: {
        userId: user.id,

        OR: [
          {
            initialDeadline: { gte: startOfMonth, lt: endOfMonth },
          },
          {
            deadline: { gte: startOfMonth, lt: endOfMonth },
          },
        ],
      },
    });

    return reminders;
  } catch (error) {
    console.error("Something went wrong while fetching reminders. ", error);
  }
}

async function GetLastReminders() {
  const user = await currentUser();
  if (!user) throw new Error("User not found");

  try {
    const currentDate = new Date();
    const DAYS_TO_SUBTRACT = 5;

    const startOfLastDays = new Date(currentDate);
    startOfLastDays.setDate(currentDate.getDate() - DAYS_TO_SUBTRACT);

    const endOfLastDays = new Date(currentDate);

    const reminders = await prisma.reminder.findMany({
      where: {
        userId: user.id,

        OR: [
          {
            initialDeadline: { gte: startOfLastDays, lt: endOfLastDays },
          },
          {
            deadline: { gte: startOfLastDays, lt: endOfLastDays },
          },
        ],
      },
    });

    return reminders;
  } catch (error) {
    console.error("Something went wrong while fetching reminders. ", error);
  }
}

async function DeleteReminder({ reminderId: id }: { reminderId: string }) {
  const user = await currentUser();
  if (!user) throw new Error("User not found");

  try {
    const reminders = await prisma.reminder.delete({
      where: {
        userId: user.id,
        id,
      },
    });

    return reminders;
  } catch (error) {
    console.error("Something went wrong while deleting reminders. ", error);
  }
}

export {
  CreateReminder,
  UpdateReminder,
  GetTodayReminders,
  GetMonthlyReminders,
  GetLastReminders,
  DeleteReminder,
};
