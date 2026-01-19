import { useCallback, useEffect, useRef, useState } from "react";
import projectData from "./projects.json";

export type ProjectItem = {
  id: string;
  year: number;
  link?: string;
  languages: string;
  img?: string;
  imgAlt?: string;
  content: ProjectCopyByLocale;
  buttons?: ProjectButton[];
};

export type ProjectCopy = {
  title: string;
  description: string;
  linkLabel?: string;
};

export type ProjectCopyByLocale = {
  no: ProjectCopy;
  en: ProjectCopy;
};

export type LocalizedString = {
  no?: string;
  en?: string;
};

export type ProjectButton = {
  href?: string;
  previewUrl?: string;
  label: LocalizedString;
  ariaLabel?: LocalizedString;
};

export type ScrollDirection = "up" | "down";
/* =========================
   Data
========================= */

export const PROJECTS = projectData as ProjectItem[];

/* =========================
   Config
========================= */

export const START_PROJECT_INDEX = 2;
export const SCROLL_VH_PER_PROJECT = 180;
export const SCROLL_INDEX_THRESHOLD = 0.6;

/* =========================
   Utils
========================= */

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const sortProjects = (projects: ProjectItem[]) =>
  [...projects].sort((a, b) => a.year - b.year);

/* =========================
   Hook
========================= */

export function useProjectScroll(projects: ProjectItem[], initialIndex = 0) {
  const scrollAreaRef = useRef<HTMLElement | null>(null);
  const safeInitialIndex = Math.min(
    Math.max(initialIndex, 0),
    Math.max(projects.length - 1, 0)
  );
  const initialProgress =
    projects.length <= 1 ? 0 : safeInitialIndex / (projects.length - 1);

  const [activeIndex, setActiveIndex] = useState(() => safeInitialIndex);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(() => initialProgress);
  const [direction, setDirection] = useState<ScrollDirection>("down");

  const lastScrollY = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const hasSetInitialScroll = useRef(false);
  const lastIndexRef = useRef<number>(safeInitialIndex);

  /* --- Hold index gyldig hvis lengde endres --- */
  useEffect(() => {
    setActiveIndex((prev) =>
      Math.min(Math.max(prev, 0), Math.max(projects.length - 1, 0))
    );
  }, [projects.length]);

  /* --- Scroll observer --- */
  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;

      /* 1️⃣ Scroll-retning */
      const currentY = window.scrollY;
      if (currentY !== lastScrollY.current) {
        const dir: ScrollDirection =
          currentY > lastScrollY.current ? "down" : "up";
        setDirection(dir);
        lastScrollY.current = currentY;
      }

      /* 2️⃣ Progress (0–1) */
      const total = el.offsetHeight - viewportH;
      const scrolled = clamp01(total <= 0 ? 1 : -rect.top / total);
      const p = total <= 0 ? 1 : clamp01(scrolled);

      /* 3️⃣ Aktiv index */
      const count = projects.length;
      let idx =
        count <= 1 ? 0 : Math.min(count - 1, Math.floor(p * count));
      if (count > 1) {
        const exact = p * (count - 1);
        const base = Math.floor(exact);
        const frac = exact - base;
        const current = lastIndexRef.current;

        if (base === current) {
          idx = frac >= SCROLL_INDEX_THRESHOLD ? base + 1 : base;
        } else if (base + 1 === current) {
          idx = frac <= 1 - SCROLL_INDEX_THRESHOLD ? base : base + 1;
        } else {
          idx = Math.min(count - 1, Math.max(0, base));
        }
      }

      setProgress((prev) => (Math.abs(prev - p) < 0.002 ? prev : p));

      setActiveIndex((prev) => {
        if (prev !== idx) {
          setPreviousIndex(prev);
          lastIndexRef.current = idx;
          return idx;
        }
        return prev;
      });
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [projects.length]);

  /* --- Start midt i listen om ønsket --- */
  useEffect(() => {
    if (hasSetInitialScroll.current) return;
    const el = scrollAreaRef.current;
    if (!el) return;

    const count = projects.length;
    if (count <= 1) {
      hasSetInitialScroll.current = true;
      return;
    }

    const targetIndex = Math.min(
      Math.max(initialIndex, 0),
      count - 1
    );

    if (targetIndex > 0) {
      const viewportH = window.innerHeight;
      const total = el.offsetHeight - viewportH;
      const sectionTopAbs =
        window.scrollY + el.getBoundingClientRect().top;
      const target =
        sectionTopAbs + (targetIndex / (count - 1)) * Math.max(0, total);
      window.scrollTo({ top: target, behavior: "auto" });
    }

    setActiveIndex(targetIndex);
    setProgress(
      count <= 1 ? 0 : targetIndex / (count - 1)
    );
    hasSetInitialScroll.current = true;
  }, [initialIndex, projects.length]);

  const scrollToIndex = useCallback(
    (idx: number) => {
      const el = scrollAreaRef.current;
      if (!el) return;

      const count = projects.length;
      if (count <= 1) return;

      const safeIndex = Math.min(Math.max(idx, 0), count - 1);

      const viewportH = window.innerHeight;
      const total = el.offsetHeight - viewportH;
      const sectionTopAbs =
        window.scrollY + el.getBoundingClientRect().top;

      const target =
        sectionTopAbs + (safeIndex / (count - 1)) * Math.max(0, total);

      window.scrollTo({ top: target, behavior: "smooth" });
    },
    [projects.length]
  );


  return {
    scrollAreaRef,

    activeIndex,
    previousIndex,
    progress,
    direction,

    scrollToIndex,
  };
}
