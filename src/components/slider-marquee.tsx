import useSWR from "swr";
import SwrFetcher from "@/lib/swr-fetcher";

const SliderMarquee = () => {
  const { data, isLoading } = useSWR(
    "https://api.quotable.io/random",
    SwrFetcher,
  );

  const motivationalPhrase: string = !isLoading && data?.content;
  const arrayOfPhrasesAndReminders: string[] = [motivationalPhrase, "teste"];

  return (
    <div className="my-6 flex h-8 w-full items-center overflow-hidden bg-secondary shadow-lg">
      <div className="marquee font-geist_mono flex gap-16 text-xs uppercase md:text-sm">
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
