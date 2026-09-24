/**
 * Human-readable public attribution. Internal production metadata
 * (Internal / By Curation / curation model) never appears as raw labels.
 */
export const CURATION_MODELS = ["External Author", "External Material", "Co-created"] as const;
export type CurationModel = (typeof CURATION_MODELS)[number];

export const CURATION_HELP: Record<CurationModel, string> = {
  "External Author": "The article was primarily written by an external author.",
  "External Material": "Indonesia Vibes developed the article based on external source material.",
  "Co-created": "Indonesia Vibes and an external contributor developed the article together.",
};

export interface AttributionInput {
  contentSource?: "Internal" | "By Curation";
  curationModel?: CurationModel;
  author?: string;
  authorRole?: string;
  sourceOrganisation?: string;
  materialPhrase?: "based" | "provided";
  coContributors?: string;
  /** Show "Edited and curated by Indonesia Vibes" under an external author. Defaults to true. */
  showCuratedLine?: boolean;
  /** Editor-supplied override for co-created attribution. */
  customLine?: string;
}

export interface Attribution {
  primary: string;
  role?: string;
  secondary?: string;
}

const HOUSE = "Indonesia Vibes";

export function attribution(input: AttributionInput): Attribution {
  const author = input.author?.trim();
  if (input.contentSource !== "By Curation") {
    return author ? { primary: `By ${author}`, ...(input.authorRole ? { role: input.authorRole } : {}) } : { primary: `By ${HOUSE}` };
  }
  const model = input.curationModel ?? (author ? "External Author" : "External Material");
  if (model === "External Author") {
    return {
      primary: `By ${author || "the author"}`,
      ...(input.authorRole ? { role: input.authorRole } : {}),
      ...(input.showCuratedLine === false ? {} : { secondary: `Edited and curated by ${HOUSE}` }),
    };
  }
  if (model === "External Material") {
    const org = input.sourceOrganisation?.trim();
    return {
      primary: `By ${HOUSE}`,
      ...(org ? { secondary: input.materialPhrase === "provided" ? `With materials provided by ${org}` : `Based on materials from ${org}` } : {}),
    };
  }
  const partners = input.coContributors?.trim() || input.sourceOrganisation?.trim() || author;
  return { primary: input.customLine?.trim() || (partners ? `By ${HOUSE} and ${partners}` : `By ${HOUSE}`) };
}

/** Short one-line credit used on cards. */
export const attributionLine = (input: AttributionInput) => attribution(input).primary;
