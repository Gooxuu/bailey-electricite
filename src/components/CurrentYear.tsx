"use client";

/**
 * Année courante calculée dans le navigateur, pour que le copyright ne reste jamais bloqué.
 * `suppressHydrationWarning` couvre le changement d'année entre le build statique et la visite.
 */
export default function CurrentYear() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
