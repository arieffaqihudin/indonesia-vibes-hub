import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Wordmark } from "@/components/brand/Wordmark";
import { navigation } from "@/lib/navigation";
import { nowItems } from "@/data/content";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-background/85 backdrop-blur-xl transition-[box-shadow,border-color] duration-300",
        scrolled ? "border-border shadow-[0_1px_0_0_var(--color-border)]" : "border-transparent",
      )}
      onMouseLeave={scheduleClose}
    >
      <div className="container-editorial flex h-16 items-center gap-4 md:h-[4.5rem]">
        <Wordmark />

        <nav aria-label="Primary" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {navigation.map((group) => {
              const isOpen = open === group.label;
              const isSimple = group.items.length === 1 && group.to;
              return (
                <li key={group.label} className="relative">
                  {isSimple ? (
                    <Link
                      to={group.to!}
                      hash={undefined}
                      onMouseEnter={() => {
                        cancelClose();
                        setOpen(null);
                      }}
                      className="inline-flex h-9 items-center rounded-sm px-3 text-sm font-medium text-ink/80 transition-colors hover:text-primary"
                      activeProps={{ className: "text-primary" }}
                    >
                      {group.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      onMouseEnter={() => {
                        cancelClose();
                        setOpen(group.label);
                      }}
                      onFocus={() => setOpen(group.label)}
                      onClick={() => setOpen(isOpen ? null : group.label)}
                      className={cn(
                        "inline-flex h-9 items-center gap-1.5 rounded-sm px-3 text-sm font-medium transition-colors",
                        isOpen ? "text-primary" : "text-ink/80 hover:text-primary",
                      )}
                    >
                      {group.label}
                      <span
                        aria-hidden
                        className={cn(
                          "h-1 w-1 rounded-full bg-primary transition-opacity duration-200",
                          isOpen ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-4">
          <Link
            to="/stories"
            aria-label="Search stories"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-blush hover:text-primary sm:inline-flex"
          >
            <Search className="h-[1.05rem] w-[1.05rem]" />
          </Link>
          <Link
            to="/collaborate"
            className="hidden h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-deep-red md:inline-flex"
          >
            Collaborate
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mega menu */}
      {navigation.map((group) => {
        const isOpen = open === group.label && group.items.length > 1;
        if (!isOpen) return null;
        return (
          <div
            key={group.label}
            onMouseEnter={cancelClose}
            className="absolute inset-x-0 top-full hidden border-b border-border bg-background/98 backdrop-blur-xl lg:block"
          >
            <div className="container-editorial grid gap-10 py-9 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,17rem)]">
              <div>
                <p className="eyebrow text-primary">{group.stage}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{group.intro}</p>
              </div>
              <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      hash={item.hash}
                      className="block rounded-sm px-3 py-3 transition-colors hover:bg-blush"
                    >
                      <span className="display-3 block text-[1.05rem] font-medium text-ink">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-l border-border pl-8">
                <p className="eyebrow text-muted-foreground">On now</p>
                <ul className="mt-3 space-y-3">
                  {nowItems.slice(0, 2).map((n) => (
                    <li key={n.id}>
                      <a href={n.href} className="group block">
                        <span className="block text-sm leading-snug font-medium text-ink group-hover:text-primary">
                          {n.headline}
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">{n.meta}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-background lg:hidden">
          <nav aria-label="Mobile" className="container-editorial py-6">
            {navigation.map((group) => (
              <div key={group.label} className="border-b border-border py-5 last:border-b-0">
                <p className="eyebrow text-primary">{group.label}</p>
                <ul className="mt-3 space-y-1">
                  {group.items.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        hash={item.hash}
                        className="flex min-h-11 items-center text-[1.05rem] font-medium text-ink"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <Link
              to="/collaborate"
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
            >
              Collaborate with us
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}