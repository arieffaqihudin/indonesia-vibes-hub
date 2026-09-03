import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { TAXONOMY_CATEGORIES, can, type TaxonomyCategory } from "@/lib/admin/types";
import { Card, EmptyState, PageHeading, PrototypeNote, SelectFilter, Table, Td, abtn, field, useConfirm } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/taxonomy")({
  head: adminHead("Taxonomy", "Controlled vocabulary for themes, geography and cultural categories."),
  component: Taxonomy,
});

function Taxonomy() {
  const admin = useAdmin();
  const [category, setCategory] = useState("All");
  const [label, setLabel] = useState("");
  const [newCategory, setNewCategory] = useState<TaxonomyCategory>("Theme");
  const [mergeFrom, setMergeFrom] = useState("");
  const [mergeInto, setMergeInto] = useState("");
  const { confirm, dialog } = useConfirm();
  const editable = can(admin.role, "configure") || admin.role === "Managing Editor";

  const terms = admin.taxonomy.filter((t) => (category === "All" ? true : t.category === category));

  return (
    <>
      <PageHeading
        eyebrow="Cultural network"
        title="Taxonomy"
        description="Shared vocabulary keeps the public filters coherent. Changes here affect how readers browse."
      />

      <div className="mb-4 max-w-xs">
        <SelectFilter label="Category" value={category} onChange={setCategory} options={["All", ...TAXONOMY_CATEGORIES]} />
      </div>

      {terms.length ? (
        <Card>
          <Table head={["Term", "Category", "Used by", "Status", ""]}>
            {terms.map((t) => (
              <tr key={t.id} className="border-t border-border">
                <Td>{t.label}</Td>
                <Td>{t.category}</Td>
                <Td>{t.usage} record{t.usage === 1 ? "" : "s"}</Td>
                <Td>{t.archived ? "Archived" : "Active"}</Td>
                <Td>
                  {editable ? (
                    <button
                      type="button"
                      className={abtn.quiet}
                      onClick={() =>
                        confirm(
                          t.archived
                            ? `Restore “${t.label}” so it can be applied again?`
                            : `Archiving “${t.label}” removes it from filters on the public platform. Continue?`,
                          () => admin.updateTaxonomy(t.id, { archived: !t.archived }),
                        )
                      }
                    >
                      {t.archived ? "Restore" : "Archive"}
                      <span className="sr-only"> {t.label}</span>
                    </button>
                  ) : null}
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      ) : (
        <EmptyState title="No terms in this category yet." />
      )}

      {editable ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card title="Add a term">
            <div className="space-y-3">
              <label className="block text-xs text-muted-foreground">
                <span className="mb-1 block">Label</span>
                <input className={field} value={label} onChange={(e) => setLabel(e.target.value)} />
              </label>
              <label className="block text-xs text-muted-foreground">
                <span className="mb-1 block">Category</span>
                <select className={field} value={newCategory} onChange={(e) => setNewCategory(e.target.value as TaxonomyCategory)}>
                  {TAXONOMY_CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className={abtn.secondary}
                disabled={!label.trim()}
                onClick={() => {
                  admin.addTaxonomy({ label, category: newCategory });
                  setLabel("");
                }}
              >
                Add term
              </button>
            </div>
          </Card>

          <Card title="Merge duplicates" description="Merging moves every record onto the surviving term.">
            <div className="space-y-3">
              <label className="block text-xs text-muted-foreground">
                <span className="mb-1 block">Merge this term</span>
                <select className={field} value={mergeFrom} onChange={(e) => setMergeFrom(e.target.value)}>
                  <option value="">Choose a term</option>
                  {admin.taxonomy.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label} ({t.category})
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs text-muted-foreground">
                <span className="mb-1 block">Into</span>
                <select className={field} value={mergeInto} onChange={(e) => setMergeInto(e.target.value)}>
                  <option value="">Choose a term</option>
                  {admin.taxonomy
                    .filter((t) => t.id !== mergeFrom)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label} ({t.category})
                      </option>
                    ))}
                </select>
              </label>
              <button
                type="button"
                className={abtn.secondary}
                disabled={!mergeFrom || !mergeInto}
                onClick={() =>
                  confirm("Merging cannot be undone in this prototype. Continue?", () => {
                    admin.mergeTaxonomy(mergeFrom, mergeInto);
                    setMergeFrom("");
                    setMergeInto("");
                  })
                }
              >
                Merge terms
              </button>
            </div>
          </Card>
        </div>
      ) : null}

      <div className="mt-6">
        <PrototypeNote>Usage counts are illustrative in this prototype and are not recalculated live.</PrototypeNote>
      </div>
      {dialog}
    </>
  );
}
