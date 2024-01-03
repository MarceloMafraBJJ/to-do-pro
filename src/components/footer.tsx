import Link from "next/link";
import { Separator } from "./ui/separator";

const Footer = () => {
  return (
    <footer className="container flex w-full items-center justify-center gap-4 pb-6">
      <Separator className="hidden md:block md:max-w-[150px] lg:max-w-[250px]" />

      <p className="text-nowrap font-geist_mono text-sm text-muted-foreground">
        Developed with 🤍 by{" "}
        <Link
          href={"https://officialmafra.vercel.app/"}
          className="text-white/90"
        >
          @officialmafra
        </Link>
      </p>

      <Separator className="hidden md:block md:max-w-[150px] lg:max-w-[250px]" />
    </footer>
  );
};

export default Footer;
