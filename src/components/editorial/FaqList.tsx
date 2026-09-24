import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { publishedFor, safeAnswerHtml, useFaqs, type Faq, type FaqPlacement } from "@/lib/faq";

export function FaqAccordion({ items }: { items: Faq[] }) {
  return (
    <ul className="border-t border-border">
      {items.map((faq) => (
        <li key={faq.id} className="border-b border-border">
          <details className="group">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-left text-[1.05rem] font-medium text-ink marker:content-none hover:text-primary focus-visible:text-primary">
              <span>{faq.question}</span>
              <Plus aria-hidden className="h-4 w-4 shrink-0 text-primary transition-transform duration-200 group-open:rotate-45" />
            </summary>
            <div
              className="faq-answer max-w-2xl pb-6 text-[0.95rem] leading-relaxed text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: safeAnswerHtml(faq.answer) }}
            />
          </details>
        </li>
      ))}
    </ul>
  );
}

/** Contextual FAQ: reuses canonical records placed on this page. */
export function ContextualFaq({ placement, limit = 6, title = "Frequently Asked Questions" }: { placement: FaqPlacement; limit?: number; title?: string }) {
  const [faqs] = useFaqs();
  const items = publishedFor(faqs, placement).slice(0, limit);
  if (!items.length) return null;
  return (
    <section className="mt-20 border-t border-border pt-10" aria-labelledby={`faq-${placement}`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id={`faq-${placement}`} className="display-2 text-ink">{title}</h2>
        <Link to="/faq" className="link-underline text-sm font-medium text-primary">View all FAQs</Link>
      </div>
      <div className="mt-8"><FaqAccordion items={items} /></div>
    </section>
  );
}
