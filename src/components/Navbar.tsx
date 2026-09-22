"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Icon from "@/components/Icons";
import Logo from "@/components/Logo";
import { NAV_LINKS, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_ENABLED, WHATSAPP_URL } from "@/lib/infos";

const trim = (path: string) => path.replace(/\/+$/, "");

export default function Navbar() {
  const pathname = trim(usePathname() ?? "");
  const [open, setOpen] = useState(false);

  const linkClass = (href: string, highlight?: boolean) => {
    const active = pathname === trim(href);
    if (highlight) {
      return `inline-flex items-center gap-1.5 rounded-full bg-navy-deep px-4 py-2 text-sm font-semibold text-white ring-1 ring-gold/70 transition-colors hover:bg-navy ${
        active ? "ring-2" : ""
      }`;
    }
    return `rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-mist ${
      active ? "text-navy underline decoration-gold decoration-2 underline-offset-8" : "text-ink"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" aria-label="Bailey Électricité — accueil" onClick={() => setOpen(false)}>
          <Logo priority className="h-12 w-auto" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(link.href, "highlight" in link ? link.highlight : false)}
              aria-current={pathname === trim(link.href) ? "page" : undefined}
            >
              {"highlight" in link && link.highlight && <Icon name="bolt" className="size-4 text-gold" />}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={PHONE_TEL}
            className="hidden items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-navy-deep transition-colors hover:bg-gold-dark sm:inline-flex"
          >
            <Icon name="phone" className="size-4" />
            {PHONE_DISPLAY}
          </a>
          <a
            href={PHONE_TEL}
            aria-label={`Appeler le ${PHONE_DISPLAY}`}
            className="inline-flex size-11 items-center justify-center rounded-full bg-gold text-navy-deep sm:hidden"
          >
            <Icon name="phone" className="size-5" />
          </a>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-line text-navy lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} className="size-5" />
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-mobile" aria-label="Navigation mobile" className="border-t border-line bg-white px-5 pb-5 pt-3 lg:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`${linkClass(link.href, "highlight" in link ? link.highlight : false)} flex w-full py-3`}
                >
                  {"highlight" in link && link.highlight && <Icon name="bolt" className="size-4 text-gold" />}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {WHATSAPP_ENABLED && (
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 rounded-full border border-navy/30 px-5 py-3 text-sm font-semibold text-navy"
            >
              <Icon name="chat" className="size-5" />
              Écrire sur WhatsApp
            </a>
          )}
        </nav>
      )}
    </header>
  );
}
