import { Link } from "@tanstack/react-router";
import markRed from "@/assets/mark-red.png";
import markWhite from "@/assets/mark-white.png";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function Wordmark({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      to="/"
      aria-label={`${brand.name} — home`}
      className={cn("group flex shrink-0 items-center gap-2.5", className)}
    >
      <img
        src={tone === "light" ? markWhite : markRed}
        alt=""
        width={36}
        height={36}
        className="h-8 w-8 object-contain transition-transform duration-500 group-hover:-translate-y-0.5"
      />
      <span
        className={cn(
          "text-[0.95rem] leading-none font-semibold tracking-tight",
          tone === "light" ? "text-primary-foreground" : "text-ink",
        )}
      >
        Indonesia<span className="text-primary"> Vibes</span>
      </span>
    </Link>
  );
}