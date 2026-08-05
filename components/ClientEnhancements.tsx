"use client";

import { useEffect } from "react";

/**
 * Revela as seções com IntersectionObserver (classe .reveal -> .in).
 * Respeita prefers-reduced-motion.
 */
export default function ClientEnhancements() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
