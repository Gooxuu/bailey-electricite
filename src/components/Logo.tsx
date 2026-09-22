import Image from "next/image";
import { BRAND, LOGO_FILE, asset } from "@/lib/infos";

/** Logo de la marque. Le fichier se change dans `LOGO_FILE` (lib/infos.ts). */
export default function Logo({ className = "h-14 w-auto", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src={asset(LOGO_FILE)}
      alt={`${BRAND} — logo`}
      width={520}
      height={160}
      className={className}
      priority={priority}
    />
  );
}
