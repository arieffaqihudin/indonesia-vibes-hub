import { authors } from "@/data/team";
import { field } from "@/components/admin/primitives";
import type { ContentItem } from "@/lib/admin/types";
import { attribution, CURATION_HELP, CURATION_MODELS, type CurationModel } from "@/lib/attribution";
import { CONTENT_SOURCES, SOURCE_HELP, contentSourceOf, type ContentSource } from "@/lib/editorial";

const input = `${field} mt-1 min-h-9 text-sm`;

type Key = string;
const GROUPS: Record<CurationModel, [Key, string, "text" | "area" | "date" | "select"][]> = {
  "External Author": [
    ["author", "Author Name", "text"], ["authorRole", "Author Role / Title", "text"], ["organisation", "Organisation", "text"],
    ["authorBio", "Short Author Bio", "area"], ["authorPhoto", "Author Photo URL", "text"], ["originalSubmission", "Original Submission / Material", "text"],
    ["editorialNotes", "Editorial Notes", "area"], ["permissionStatus", "Permission Status", "select"],
  ],
  "External Material": [
    ["originalSource", "Original Source", "text"], ["sourceOrganisation", "Source Organisation", "text"], ["originalAuthor", "Original Author / Creator", "text"],
    ["originalUrl", "Original URL", "text"], ["originalPublicationDate", "Original Publication Date", "date"], ["sourceNotes", "Source Notes", "area"],
    ["permissionStatus", "Permission / Usage Status", "select"],
  ],
  "Co-created": [
    ["coContributors", "External Contributors / Organisations", "text"], ["author", "Lead Indonesia Vibes Author", "text"],
    ["attributionLine", "Public Attribution (optional override)", "text"], ["editorialNotes", "Editorial Notes", "area"], ["permissionStatus", "Permission Status", "select"],
  ],
};
const PERMISSIONS = ["Not checked", "Requested", "Granted", "Restricted"];

export const CURATION_CHECKS = ["attributionComplete", "sourceComplete", "permissionChecked", "editorialReviewComplete"] as const;
const CHECK_LABEL: Record<(typeof CURATION_CHECKS)[number], string> = {
  attributionComplete: "Attribution complete",
  sourceComplete: "Source complete",
  permissionChecked: "Permission checked",
  editorialReviewComplete: "Editorial review complete",
};

export function curationModelOf(item: ContentItem): CurationModel {
  const v = item.fields["curationModel"];
  return (CURATION_MODELS as readonly string[]).includes(v ?? "") ? (v as CurationModel) : "External Author";
}

export function previewAttribution(item: ContentItem) {
  const f = item.fields;
  return attribution({
    contentSource: contentSourceOf(item),
    curationModel: curationModelOf(item),
    ...(f["author"] ? { author: f["author"] } : {}),
    ...(f["authorRole"] ? { authorRole: f["authorRole"] } : {}),
    ...(f["sourceOrganisation"] || item.sourceAttribution ? { sourceOrganisation: f["sourceOrganisation"] || item.sourceAttribution! } : {}),
    ...(f["materialPhrase"] === "provided" ? { materialPhrase: "provided" as const } : {}),
    ...(f["coContributors"] ? { coContributors: f["coContributors"] } : {}),
    ...(f["attributionLine"] ? { customLine: f["attributionLine"] } : {}),
    showCuratedLine: f["showCuratedLine"] !== "no",
  });
}

export function AttributionSettings({
  item,
  patchFields,
  setSource,
}: {
  item: ContentItem;
  patchFields: (patch: Record<string, string>) => void;
  setSource: (source: ContentSource) => void;
}) {
  const source = contentSourceOf(item);
  const model = curationModelOf(item);
  const credit = previewAttribution(item);
  const f = item.fields;
  return (
    <div className="space-y-3">
      <label className="block text-xs text-muted-foreground">Content Source
        <select className={input} value={source} onChange={(e) => setSource(e.target.value as ContentSource)}>
          {CONTENT_SOURCES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <span className="mt-1 block text-[0.68rem]">{SOURCE_HELP[source]}</span>
      </label>

      {source === "Internal" ? (
        <>
          <label className="block text-xs text-muted-foreground">Author<select className={input} value={f["author"] ?? ""} onChange={(e) => { const a = authors.find((x) => x.name === e.target.value); patchFields({ author: e.target.value, authorRole: a?.role ?? "" }); }}><option value="">Indonesia Vibes</option>{authors.map((a) => <option key={a.id} value={a.name}>{a.name}{a.role ? ` — ${a.role}` : ""}</option>)}{f["author"] && !authors.some((a) => a.name === f["author"]) ? <option value={f["author"]}>{f["author"]} (unlisted)</option> : null}</select><span className="mt-1 block text-[0.68rem]">Only authorised authors. People related to the subject go in Connections.</span></label>
          <label className="block text-xs text-muted-foreground">Editor<input className={input} value={f["editor"] ?? ""} onChange={(e) => patchFields({ editor: e.target.value })} /></label>
        </>
      ) : (
        <div className="space-y-3 border-l-2 border-blush pl-3">
          <label className="block text-xs text-muted-foreground">Curation Model
            <select className={input} value={model} onChange={(e) => patchFields({ curationModel: e.target.value })}>
              {CURATION_MODELS.map((m) => <option key={m}>{m}</option>)}
            </select>
            <span className="mt-1 block text-[0.68rem]">{CURATION_HELP[model]}</span>
          </label>
          {GROUPS[model].map(([key, label, type]) => (
            <label key={key} className="block text-xs text-muted-foreground">{label}
              {type === "area" ? <textarea rows={2} className={input} value={f[key] ?? ""} onChange={(e) => patchFields({ [key]: e.target.value })} />
                : type === "select" ? <select className={input} value={f[key] ?? "Not checked"} onChange={(e) => patchFields({ [key]: e.target.value })}>{PERMISSIONS.map((p) => <option key={p}>{p}</option>)}</select>
                : <input type={type === "date" ? "date" : "text"} className={input} value={f[key] ?? ""} onChange={(e) => patchFields({ [key]: e.target.value })} />}
            </label>
          ))}
          {model === "External Author" ? (
            <label className="flex items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" checked={f["showCuratedLine"] !== "no"} onChange={(e) => patchFields({ showCuratedLine: e.target.checked ? "yes" : "no" })} /> Show “Edited and curated by Indonesia Vibes”</label>
          ) : null}
          {model === "External Material" ? (
            <label className="block text-xs text-muted-foreground">Public wording
              <select className={input} value={f["materialPhrase"] ?? "based"} onChange={(e) => patchFields({ materialPhrase: e.target.value })}>
                <option value="based">Based on materials from …</option>
                <option value="provided">With materials provided by …</option>
              </select>
            </label>
          ) : null}
        </div>
      )}

      <div className="rounded border border-border bg-muted/40 p-3">
        <p className="text-[0.62rem] font-semibold tracking-[0.12em] text-clay uppercase">Public attribution preview</p>
        <p className="mt-1.5 text-sm text-ink">{credit.primary}{credit.role ? <span className="text-muted-foreground">, {credit.role}</span> : null}</p>
        {credit.secondary ? <p className="text-xs text-muted-foreground">{credit.secondary}</p> : null}
      </div>

      {source === "By Curation" ? (
        <fieldset className="space-y-1.5">
          <legend className="text-xs font-medium text-ink">Curation checks</legend>
          {CURATION_CHECKS.map((key) => (
            <label key={key} className="flex min-h-8 items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" checked={f[key] === "yes"} onChange={(e) => patchFields({ [key]: e.target.checked ? "yes" : "" })} /> {CHECK_LABEL[key]}
            </label>
          ))}
        </fieldset>
      ) : null}
    </div>
  );
}
