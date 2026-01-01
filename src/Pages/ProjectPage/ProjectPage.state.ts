import { useCallback, useEffect, useRef, useState } from "react";
import projectData from "./projects.json";

export type ProjectItem = {
  id: string;
  year: number;
  link?: string;
  languages: string;
  img?: string;
  imgAlt?: string;
  content: {
    short: ProjectCopyByLocale;
    Long?: ProjectCopyByLocale;
  };
};

export type ProjectCopy = {
  title: string;
  role: string;
  description: string;
  meta: string;
  linkLabel?: string;
  imageCaption: string;
  buttons?: ProjectButton[];
};

export type ProjectCopyByLocale = {
  no: ProjectCopy;
  en: ProjectCopy;
};

export type ProjectContentVariant = "short" | "Long";

export type ProjectButton = {
  href?: string;
  previewUrl?: string;
  label: string;
  ariaLabel?: string;
};

export type ScrollDirection = "up" | "down";
export type LeavingState = {
  index: number;
  phase: "start" | "exit";
} | null;

/* =========================
   Data
========================= */

export const PROJECTS = projectData as ProjectItem[];

/* =========================
   Config
========================= */

export const START_PROJECT_INDEX = 3;
export const SCROLL_VH_PER_PROJECT = 180;
export const ANIMATION_DURATION_MS = 700;
export const ANIMATION_OFFSET_PX = 72;
export const ANIMATION_SCALE_FROM = 0.96;
export const ANIMATION_SCALE_TO = 1.02;
export const ANIMATION_BLUR_PX = 6;

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
  const [leaving, setLeaving] = useState<LeavingState>(null);
  const [enteringPhase, setEnteringPhase] = useState<"from" | "to">("to");
  const [progress, setProgress] = useState(() => initialProgress);
  const [direction, setDirection] = useState<ScrollDirection>("down");

  const lastScrollY = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const hasSetInitialScroll = useRef(false);

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
      const idx =
        count <= 1 ? 0 : Math.min(count - 1, Math.floor(p * count));

      setProgress((prev) => (Math.abs(prev - p) < 0.002 ? prev : p));

      setActiveIndex((prev) => {
        if (prev !== idx) {
          setPreviousIndex(prev);
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

  /* --- Trigger inn/ut-animasjon når index byttes --- */
  useEffect(() => {
    if (previousIndex === null || previousIndex === activeIndex) {
      return;
    }

    setLeaving({ index: previousIndex, phase: "start" });
    setEnteringPhase("from");

    const raf = window.requestAnimationFrame(() => {
      setLeaving((prev) => (prev ? { ...prev, phase: "exit" } : prev));
      setEnteringPhase("to");
    });

    const timer = window.setTimeout(() => {
      setLeaving(null);
    }, ANIMATION_DURATION_MS);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [activeIndex, previousIndex]);

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
    leaving,
    enteringPhase,
    progress,
    direction,

    scrollToIndex,
  };
}
