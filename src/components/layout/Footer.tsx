import { Link } from "@tanstack/react-router";
import markWhite from "@/assets/mark-white.png";
import { brand } from "@/lib/brand";
import { navigation } from "@/lib/navigation";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink-deep text-[oklch(0.95_0.01_40)]">
      <div className="container-editorial py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <img src={markWhite} alt="" width={40} height={40} className="h-9 w-9 object-contain" />
              <span className="text-base font-semibold tracking-tight">{brand.name}</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[oklch(0.82_0.02_30)]">
              {brand.mission}
            </p>
            <p className="mt-5 max-w-sm text-xs leading-relaxed text-[oklch(0.7_0.02_30)]">
              {brand.markMeaning}
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {navigation.map((group) => (
              <div key={group.label}>
                <p className="eyebrow text-pink">{group.label}</p>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className="text-sm text-[oklch(0.88_0.015_30)] transition-colors hover:text-pink"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="max-w-3xl text-xs leading-relaxed text-[oklch(0.7_0.02_30)]">
            Prototype: this is a demonstration platform. Stories, profiles, events and opportunities
            are written as realistic editorial examples and are not live listings. Named people,
            institutions and programmes are illustrative.
          </p>
          <p className="mt-3 max-w-3xl text-xs leading-relaxed text-[oklch(0.7_0.02_30)]">
            Editorial policy:{" "}
            <Link to="/editorial-standards" className="underline underline-offset-4 hover:text-pink">
              how we source, review and credit
            </Link>
            .
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-[oklch(0.72_0.02_30)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.organisation}. Published in English for a global
            audience.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            {brand.social.map((s) => (
              <a key={s.label} href={s.href} className="transition-colors hover:text-pink">
                {s.label}
              </a>
            ))}
            <a href={`mailto:${brand.email}`} className="transition-colors hover:text-pink">
              {brand.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}