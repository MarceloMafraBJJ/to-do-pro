"use client";

import FrequencyItem from "@/components/frequency-item";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Reminder } from "@prisma/client";

import Autoplay from "embla-carousel-autoplay";

interface FrequencyItemsWrapperProps {
  day: string;
  percentage: string;
  completedReminders: number;
  totalReminders: number;
  reminders: Reminder[];
}

const FrequencyItemsWrapper = ({
  reminders,
}: {
  reminders: FrequencyItemsWrapperProps[];
}) => {
  return (
    <Carousel
      className="mx-auto w-[70%]"
      plugins={[
        Autoplay({
          delay: 8000,
        }),
      ]}
    >
      <CarouselContent>
        {reminders.map((reminder) => (
          <CarouselItem key={reminder.day} className="basis-1/2 lg:basis-1/5">
            <FrequencyItem {...reminder} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default FrequencyItemsWrapper;
