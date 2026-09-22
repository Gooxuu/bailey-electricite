import Image from "next/image";
import type { ReactNode } from "react";
import Icon from "@/components/Icons";
import { asset } from "@/lib/infos";
import type { Photo } from "@/lib/photos";

const RATIOS = {
  "4/3": "aspect-[4/3]",
  "16/10": "aspect-[16/10]",
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
} as const;

type Props = {
  photo: Photo;
  ratio?: keyof typeof RATIOS;
  tone?: "light" | "dark";
  /** Pour l'image au-dessus de la ligne de flottaison (héros). */
  priority?: boolean;
  sizes?: string;
  overlay?: ReactNode;
  className?: string;
};

/**
 * Cadre photo. Sans `photo.src` : cadre de remplacement soigné, prêt à recevoir la vraie photo
 * (voir lib/photos.ts). Avec `photo.src` : image plein cadre.
 */
export default function PhotoSlot({
  photo,
  ratio = "4/3",
  tone = "light",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  overlay,
  className = "",
}: Props) {
  const placeholder =
    tone === "dark" ? "border-white/20 bg-white/5 text-white/70" : "border-navy/20 bg-gradient-to-br from-mist to-green/10 text-navy/75";

  return (
    <figure className={`relative overflow-hidden rounded-3xl ${RATIOS[ratio]} ${className}`}>
      {photo.src ? (
        <Image src={asset(photo.src)} alt={photo.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div
          role="img"
          aria-label={photo.alt}
          className={`flex h-full w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed ${placeholder}`}
        >
          <Icon name="camera" className="size-9" />
          <span className="text-sm font-semibold">{photo.caption}</span>
          <span className="text-xs opacity-80">Photo de réalisation à ajouter</span>
        </div>
      )}
      {overlay && <div className="absolute inset-x-0 bottom-0 p-4">{overlay}</div>}
    </figure>
  );
}
