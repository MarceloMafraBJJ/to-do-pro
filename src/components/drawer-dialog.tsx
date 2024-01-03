import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/lib/use-media-query";
import { LucideIcon, Plus } from "lucide-react";
import ReminderForm from "./reminder-form";
import { Reminder } from "@prisma/client";

const DrawerDialog = ({
  alternativeIcon: Icon,
  reminder,
}: {
  alternativeIcon?: LucideIcon;
  reminder?: Reminder;
}) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {Icon ? (
            <Button
              variant={"ghost"}
              size={"icon"}
              className={"min-w-[40px] items-center"}
              onClick={() => setOpen(true)}
            >
              <Icon size={16} />
            </Button>
          ) : (
            <Button className="gap-2 font-semibold uppercase">
              new <Plus size={16} strokeWidth={3} />
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a reminder, or something else.</DialogTitle>
            <DialogDescription>
              You can create some reminders right here.
            </DialogDescription>
          </DialogHeader>

          <ReminderForm setOpenDialog={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {Icon ? (
          <Button
            variant={"ghost"}
            size={"icon"}
            className={"min-w-[40px] items-center"}
            onClick={() => setOpen(true)}
          >
            <Icon size={16} />
          </Button>
        ) : (
          <Button className="gap-2 font-semibold uppercase">
            new <Plus size={16} strokeWidth={3} />
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create a reminder, or something else.</DrawerTitle>
          <DrawerDescription>
            You can create some reminders right here.
          </DrawerDescription>
        </DrawerHeader>

        <ReminderForm
          className={`${!isDesktop && "mb-4 p-4"}`}
          setOpenDialog={setOpen}
          reminder={reminder}
        />
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerDialog;
