import textileHero from "@/assets/textile-hero.jpg";
import gamelan from "@/assets/gamelan.jpg";
import maritime from "@/assets/maritime.jpg";
import cinema from "@/assets/cinema.jpg";
import performance from "@/assets/performance.jpg";
import design from "@/assets/design.jpg";
import forest from "@/assets/forest.jpg";
import exhibition from "@/assets/exhibition.jpg";
import heritage from "@/assets/heritage.jpg";
import culinary from "@/assets/culinary.jpg";
import abroad from "@/assets/abroad.jpg";
import institutionMuseum from "@/assets/institution-museum.jpg";
import { publicUrl } from "@/lib/public-seo";

const covers = new Map([
  [textileHero, "textile-hero.jpg"], [gamelan, "gamelan.jpg"],
  [maritime, "maritime.jpg"], [cinema, "cinema.jpg"],
  [performance, "performance.jpg"], [design, "design.jpg"],
  [forest, "forest.jpg"], [exhibition, "exhibition.jpg"],
  [heritage, "heritage.jpg"], [culinary, "culinary.jpg"],
  [abroad, "abroad.jpg"], [institutionMuseum, "institution-museum.jpg"],
]);

/** Only tag images actually shown on the page, using their share-sized rendition. */
export function socialImageUrl(image?: string) {
  if (!image) return null;
  const name = covers.get(image);
  return name ? publicUrl(`/share/${name}`) : image.startsWith("https://") ? image : null;
}

export function socialImageMeta(image?: string) {
  const url = socialImageUrl(image);
  return url ? [
    { property: "og:image", content: url },
    { name: "twitter:image", content: url },
  ] : [];
}