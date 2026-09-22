import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/infos";

// Obligatoire avec `output: "export"` : sans ça, le build refuse la route.
export const dynamic = "force-static";

const ROUTES = [
  "/",
  "/electricite-generale/",
  "/chauffage-climatisation-ventilation/",
  "/bornes-de-recharge-irve/",
  "/contact/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "yearly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
