import type { ReactNode } from "react";
import ContactButtons from "@/components/ContactButtons";

/** Conteneur centré commun à toutes les sections. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-6xl px-5 ${className}`}>{children}</div>;
}

type HeadingProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
  /** « h1 » pour le titre principal d'une page, « h2 » sinon. */
  as?: "h1" | "h2";
};

export function SectionHeading({ eyebrow, title, intro, tone = "light", align = "left", as: Tag = "h2" }: HeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className={`text-sm font-bold uppercase tracking-wider ${dark ? "text-gold" : "text-green"}`}>{eyebrow}</p>
      )}
      <Tag className={`mt-2 font-display text-3xl font-extrabold leading-tight sm:text-4xl ${dark ? "text-white" : "text-navy"}`}>
        {title}
      </Tag>
      {intro && <p className={`mt-4 text-lg leading-relaxed ${dark ? "text-white/80" : "text-muted"}`}>{intro}</p>}
    </div>
  );
}

/** Bandeau d'appel à l'action de fin de page. */
export function CtaBand({ title, text }: { title: string; text: string }) {
  return (
    <section className="bg-navy py-16">
      <Container className="text-center">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold leading-tight text-white">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">{text}</p>
        <ContactButtons tone="dark" size="lg" showEmail className="mt-8 justify-center" />
      </Container>
    </section>
  );
}
