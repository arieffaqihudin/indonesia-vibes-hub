import { Suspense, lazy, type ComponentProps } from "react";

const Editor = lazy(() => import("./RichText").then((m) => ({ default: m.RichText })));

type Props = ComponentProps<typeof import("./RichText").RichText>;

/** Loads the writing editor only on screens that need it, with a light skeleton meanwhile. */
export function RichText(props: Props) {
  return <Suspense fallback={<div aria-busy="true" className="space-y-3 rounded-md border border-border bg-background p-4"><div className="h-4 w-2/3 animate-pulse rounded bg-muted" /><div className="h-4 w-full animate-pulse rounded bg-muted" /><div className="h-4 w-5/6 animate-pulse rounded bg-muted" /><div className="h-24" /></div>}><Editor {...props} /></Suspense>;
}
export type { Props as RichTextProps };
