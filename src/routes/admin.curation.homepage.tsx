import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { can, type CurationSlot } from "@/lib/admin/types";
import { Card, EmptyState, PageHeading, PrototypeNote, abtn, dateFmt, field } from "@/components/admin/primitives";

const SECTIONS: CurationSlot["section"][] = [
  "Hero",
  "In Focus",
  "Featured Collection",
  "People & Organisations",
  "Coming Up",
  "Collaborations",
];

export const Route = createFileRoute("/admin/curation/homepage")({
  head: adminHead("Homepage curation", "Choose what the public homepage leads with."),
  component: HomepageCuration,
});

function HomepageCuration() {
  const admin = useAdmin();
  const editable = can(admin.role, "editorial");
  const published = admin.content.filter((c) => c.status === "published");
  const [section, setSection] = useState<CurationSlot["section"]>("Hero");
  const [contentId, setContentId] = useState("");

  const move = (slot: CurationSlot, delta: number) => {
    const inSection = admin.curation.filter((s) => s.section === slot.section).sort((a, b) => a.order - b.order);
    const index = inSection.findIndex((s) => s.id === slot.id);
    const target = inSection[index + delta];
    if (!target) return;
    admin.setCuration(
      admin.curation.map((s) =>
        s.id === slot.id ? { ...s, order: target.order } : s.id === target.id ? { ...s, order: slot.order } : s,
      ),
    );
  };

  return (
    <>
      <PageHeading
        eyebrow="Curation"
        title="Homepage"
        description="Only published records can be featured. Curation is an editorial judgement, not an automatic ranking."
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-4">
          {SECTIONS.map((s) => {
            const slots = admin.curation.filter((slot) => slot.section === s).sort((a, b) => a.order - b.order);
            return (
              <Card key={s} title={s}>
                {slots.length ? (
                  <ul className="space-y-2 text-sm">
                    {slots.map((slot) => {
                      const item = admin.getContent(slot.contentId);
                      return (
                        <li key={slot.id} className="flex flex-wrap items-center justify-between gap-2">
                          <div className="min-w-0">
                            {item ? (
                              <Link to="/admin/content/$id" params={{ id: item.id }} className="text-ink hover:text-primary">
                                {slot.label || item.title}
                              </Link>
                            ) : (
                              <span className="text-primary">Missing record — remove this slot</span>
                            )}
                            {slot.scheduledUntil ? (
                              <p className="text-xs text-muted-foreground">Featured until {dateFmt(slot.scheduledUntil)}</p>
                            ) : null}
                          </div>
                          {editable ? (
                            <div className="flex items-center gap-1">
                              <button type="button" className={abtn.quiet} onClick={() => move(slot, -1)}>
                                Move up<span className="sr-only">: {slot.label}</span>
                              </button>
                              <button type="button" className={abtn.quiet} onClick={() => move(slot, 1)}>
                                Move down<span className="sr-only">: {slot.label}</span>
                              </button>
                              <button
                                type="button"
                                className={abtn.quiet}
                                onClick={() => admin.setCuration(admin.curation.filter((x) => x.id !== slot.id))}
                              >
                                Remove<span className="sr-only">: {slot.label}</span>
                              </button>
                            </div>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <EmptyState title="Nothing chosen for this section." hint="The public site falls back to the most recent published records." />
                )}
              </Card>
            );
          })}
        </div>

        <aside className="space-y-4">
          {editable ? (
            <Card title="Feature a record">
              <label className="block text-xs text-muted-foreground">
                <span className="mb-1 block">Section</span>
                <select className={field} value={section} onChange={(e) => setSection(e.target.value as CurationSlot["section"])}>
                  {SECTIONS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="mt-3 block text-xs text-muted-foreground">
                <span className="mb-1 block">Published record</span>
                <select className={field} value={contentId} onChange={(e) => setContentId(e.target.value)}>
                  <option value="">Choose a record</option>
                  {published.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className={`${abtn.primary} mt-3`}
                disabled={!contentId}
                onClick={() => {
                  const item = admin.getContent(contentId);
                  if (!item) return;
                  admin.setCuration([
                    ...admin.curation,
                    {
                      id: `cu-${Date.now().toString(36)}`,
                      section,
                      contentId,
                      label: item.title,
                      order: admin.curation.filter((s) => s.section === section).length + 1,
                    },
                  ]);
                  setContentId("");
                }}
              >
                Add to section
              </button>
            </Card>
          ) : (
            <Card title="Read-only">
              <p className="text-sm text-muted-foreground">Your role can view curation but not change it.</p>
            </Card>
          )}
          <PrototypeNote>Curation changes are stored in this prototype only and do not alter the live public site.</PrototypeNote>
        </aside>
      </div>
    </>
  );
}
