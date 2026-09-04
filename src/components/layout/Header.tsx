import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Wordmark } from "@/components/brand/Wordmark";
import { navigation } from "@/lib/navigation";
import { getFreshContent } from "@/lib/freshness";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastY = useRef(0);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const focus = getFreshContent({ limit: 2, maxPerFamily: 1 });

  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 12);
      // Retreat on the way down, return immediately on the way up.
      const delta = y - lastY.current;
      if (y < 120) setHidden(false);
      else if (delta > 6) setHidden(true);
      else if (delta < -4) setHidden(false);
      lastY.current = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
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

  // The mobile menu owns the screen: the page behind it must not scroll.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);


  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const retracted = hidden && !open && !mobileOpen;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-xl",
        "transition-[transform,box-shadow,border-color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        scrolled
          ? "border-border bg-background/92 shadow-[0_1px_0_0_var(--color-border)]"
          : "border-transparent bg-background/80",
        retracted ? "-translate-y-full" : "translate-y-0",
      )}
      onMouseLeave={scheduleClose}
    >
      <div
        className={cn(
          "container-editorial flex items-center gap-4 transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled ? "h-14 md:h-16" : "h-16 md:h-[4.5rem]",
        )}
      >
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

        <div className="ml-auto flex items-center gap-1 sm:gap-2 lg:ml-4">
          <Link
            to="/search"
            search={{ q: "" }}
            aria-label="Search Indonesia Vibes"
            className="press inline-flex h-11 w-11 items-center justify-center rounded-full text-ink/70 hover:bg-blush hover:text-primary lg:h-9 lg:w-9"
          >
            <Search className="h-[1.05rem] w-[1.05rem]" />
          </Link>


          <Link
            to="/collaborate"
            className="press hidden h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-deep-red md:inline-flex"
          >
            Collaborate
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="press inline-flex h-11 w-11 items-center justify-center rounded-full text-ink lg:hidden"
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
            className="menu-in absolute inset-x-0 top-full hidden border-b border-border bg-background/98 backdrop-blur-xl lg:block"
          >
            <div className="container-editorial grid gap-10 py-9 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,17rem)]">
              <div className="stagger-item">
                <p className="eyebrow text-primary">{group.stage}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{group.intro}</p>
              </div>
              <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
                {group.items.map((item, i) => (
                  <li
                    key={item.to}
                    className="stagger-item"
                    style={{ ["--reveal-delay" as string]: `${40 + i * 45}ms` }}
                  >
                    <Link
                      to={item.to}
                      {...(item.hash ? { hash: item.hash } : {})}
                      className="group block rounded-sm px-3 py-3 transition-colors duration-200 hover:bg-blush"
                    >
                      <span className="display-3 block text-[1.05rem] font-medium text-ink transition-colors duration-200 group-hover:text-primary">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div
                className="stagger-item border-l border-border pl-8"
                style={{ ["--reveal-delay" as string]: "140ms" }}
              >
                <p className="eyebrow text-muted-foreground">In focus</p>
                <ul className="mt-3 space-y-3">
                  {focus.map((n) => (
                    <li key={n.id}>
                      <Link to={n.href} className="group block">
                        <span className="eyebrow block text-primary">{n.label}</span>
                        <span className="mt-1 block text-sm leading-snug font-medium text-ink transition-colors duration-200 group-hover:text-primary">
                          {n.headline}
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">{n.meta}</span>
                      </Link>
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
        <div className="menu-in max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-background lg:hidden">

          <nav aria-label="Mobile" className="container-editorial py-6">
            {navigation.map((group) => (
              <div key={group.label} className="border-b border-border py-5 last:border-b-0">
                <p className="eyebrow text-primary">{group.label}</p>
                <ul className="mt-3 space-y-1">
                  {group.items.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        {...(item.hash ? { hash: item.hash } : {})}
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