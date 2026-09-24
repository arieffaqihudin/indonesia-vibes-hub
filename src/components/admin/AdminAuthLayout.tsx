import type { ReactNode } from "react";

import textileHero from "@/assets/textile-hero.jpg";
import markRed from "@/assets/mark-red.png";

export function AdminAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh bg-sand lg:grid-cols-[minmax(0,1.35fr)_minmax(25rem,1fr)]">
      <section className="relative hidden min-h-dvh overflow-hidden lg:block" aria-label="Indonesia Vibes">
        <img src={textileHero} alt="Indonesian textile craftsmanship" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/90 via-ink/25 to-ink/10" />
        <div className="relative flex h-full max-w-3xl flex-col justify-between p-12 xl:p-16">
          <div className="flex items-center gap-3 text-primary-foreground">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-card/10 backdrop-blur-sm"><img src={markRed} alt="" className="h-7 w-7 object-contain" /></span>
            <span className="text-base font-semibold">Indonesia Vibes</span>
          </div>
          <div className="max-w-xl pb-4 text-primary-foreground">
            <p className="text-sm font-medium uppercase">Culture for the Future</p>
            <p className="mt-4 text-3xl font-medium leading-tight xl:text-4xl">A platform to understand, experience, and connect with Indonesia.</p>
          </div>
        </div>
      </section>
      <section className="flex min-h-dvh flex-col bg-background">
        <header className="px-6 pt-7 sm:px-10 lg:hidden"><div className="flex items-center gap-2.5"><img src={markRed} alt="" className="h-8 w-8 object-contain" /><span className="text-sm font-semibold text-ink">Indonesia Vibes</span></div></header>
        <div className="flex flex-1 items-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16"><div className="mx-auto w-full max-w-[27rem]">{children}</div></div>
        <footer className="px-6 pb-6 text-center text-xs text-muted-foreground sm:px-10">© {new Date().getFullYear()} Indonesia Vibes</footer>
      </section>
    </div>
  );
}