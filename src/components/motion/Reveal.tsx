import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

export type RevealVariant = "up" | "down" | "scale" | "mask" | "mask-x" | "fade";

/**
 * Reveals an element once, when it first enters the viewport.
 *
 * Motion is opt-in: the hidden state only applies under `html.motion-ready`
 * (set by the head script when the visitor has not asked for reduced motion),
 * so no-JS and reduced-motion visitors always see the content immediately.
 */
export function useReveal<T extends HTMLElement>(options?: {
  threshold?: number;
  rootMargin?: string;
}) {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      {
        threshold: options?.threshold ?? 0.12,
        rootMargin: options?.rootMargin ?? "0px 0px -8% 0px",
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown, options?.threshold, options?.rootMargin]);

  return { ref, shown } as const;
}

export function Reveal({
  as,
  variant = "up",
  delay = 0,
  className,
  style,
  children,
  threshold,
}: {
  as?: ElementType;
  variant?: RevealVariant;
  /** Stagger offset in ms — keep groups within 60–100ms steps. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  threshold?: number;
}) {
  const Tag = (as ?? "div") as ElementType;
  const { ref, shown } = useReveal<HTMLElement>(
    threshold === undefined ? undefined : { threshold },
  );

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      data-shown={shown ? "true" : "false"}
      className={className}
      style={{ ...(style ?? {}), ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/** Convenience for card grids: wraps each child with a staggered reveal. */
export function RevealList({
  children,
  step = 70,
  variant = "up",
  className,
}: {
  children: ReactNode[];
  step?: number;
  variant?: RevealVariant;
  className?: string;
}) {
  return (
    <>
      {children.map((child, i) => (
        <Reveal key={i} variant={variant} delay={Math.min(i, 6) * step} className={className}>
          {child}
        </Reveal>
      ))}
    </>
  );
}
