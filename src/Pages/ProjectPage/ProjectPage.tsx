import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../../components/pageSections/Header";
import Footer from "../../components/pageSections/Footer";
import noImg from "../../assets/ProjectImages/noimg.avif";

import {
  PROJECTS,
  START_PROJECT_INDEX,
  ANIMATION_DURATION_MS,
  ANIMATION_OFFSET_PX,
  ANIMATION_SCALE_FROM,
  ANIMATION_SCALE_TO,
  ANIMATION_BLUR_PX,
  SCROLL_VH_PER_PROJECT,
  sortProjects,
  useProjectScroll,
  type ProjectItem,
  type ProjectCopy,
} from "./ProjectPage.state";

const projectImages = import.meta.glob("../../assets/ProjectImages/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const getProjectImageSrc = (img?: string) => {
  if (!img) return noImg;
  return projectImages[`../../assets/ProjectImages/${img}`] ?? noImg;
};

const getProjectCopy = (
  project: ProjectItem,
  language: string | undefined
): ProjectCopy => {
  const key = language?.startsWith("no") ? "no" : "en";
  return project.content.short[key] ?? project.content.short.en;
};

function ProjectPage() {
  const { t } = useTranslation();

  const projects = useMemo(() => sortProjects(PROJECTS), []);

  return (
    <div className="relative min-h-screen bg-paper text-ink">
      <Header />

      <section className="mx-auto w-full max-w-6xl px-6 pt-12 pb-6">
        <p className="text-xs uppercase tracking-[0.35em] text-ink/60">
          {t("projectPage.tagline")}
        </p>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl">
          {t("projectPage.title")}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-ink/70 sm:text-lg">
          {t("projectPage.description")}
        </p>
      </section>

      <main className="mx-auto w-full max-w-6xl px-6 pb-24">
        <ScrollProjects projects={projects} />
      </main>

      <Footer />
    </div>
  );
}

function ScrollProjects({ projects }: { projects: ProjectItem[] }) {
  const { i18n } = useTranslation();
  const {
    scrollAreaRef,
    activeIndex,
    leaving,
    enteringPhase,
    progress,
    direction,
    scrollToIndex,
  } = useProjectScroll(projects, START_PROJECT_INDEX);

  const active = projects[activeIndex] ?? projects[0];
  const activeCopy = active
    ? getProjectCopy(active, i18n.resolvedLanguage ?? i18n.language)
    : null;
  const leavingProject =
    leaving && projects[leaving.index] ? projects[leaving.index] : null;

  const isScrollingDown = direction === "down";
  const enterScale = isScrollingDown ? 1 : ANIMATION_SCALE_FROM;
  const leaveScale = isScrollingDown ? 1 : ANIMATION_SCALE_TO;

  const transitionStyle = {
    transitionDuration: `${ANIMATION_DURATION_MS}ms`,
  };
  const enterFromStyle = {
    opacity: 0,
    transform: `translateY(${isScrollingDown ? ANIMATION_OFFSET_PX : -ANIMATION_OFFSET_PX}px) scale(${enterScale})`,
    filter: `blur(${ANIMATION_BLUR_PX}px)`,
  };
  const enterToStyle = {
    opacity: 1,
    transform: "translateY(0px) scale(1)",
    filter: "blur(0px)",
  };
  const leaveToStyle = {
    opacity: 0,
    transform: `translateY(${isScrollingDown ? -ANIMATION_OFFSET_PX : ANIMATION_OFFSET_PX}px) scale(${leaveScale})`,
    filter: `blur(${ANIMATION_BLUR_PX}px)`,
  };

  return (
    <section
      ref={scrollAreaRef}
      className="relative"
      style={{ height: `${Math.max(1, projects.length) * SCROLL_VH_PER_PROJECT}vh` }}
    >
      {/* Sticky “ramme” som står i ro mens du scroller */}
      <div className="sticky top-20">
        <div className="rounded-3xl border border-sand/80 bg-white/80 p-5 shadow-card backdrop-blur">
          {/* ÅR / PROGRESSBAR */}
          <div className="mb-6">
            <div className="relative">
              <div className="h-1 w-full rounded-full bg-ink/10" />
              <div
                className="absolute left-0 top-0 h-1 w-full origin-left rounded-full bg-ink"
                style={{ transform: `scaleX(${progress})` }}
                aria-hidden="true"
              />
            </div>

            <ol className="mt-4 flex items-start justify-between gap-2">
              {projects.map((p, i) => {
                const isActive = i === activeIndex;
                return (
                  <li key={p.id} className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => scrollToIndex(i)}
                      className="group w-full text-left"
                      aria-current={isActive ? "true" : undefined}
                    >
                      <div className="flex items-center justify-center">
                        <span
                          className={[
                            "h-3 w-3 rounded-full border transition",
                            isActive
                              ? "border-ink bg-ink"
                              : "border-ink/30 bg-white group-hover:border-ink/60",
                          ].join(" ")}
                        />
                      </div>
                      <div
                        className={[
                          "mt-2 truncate text-center text-[0.65rem] uppercase tracking-[0.3em] transition",
                          isActive ? "text-ink" : "text-ink/50 group-hover:text-ink/70",
                        ].join(" ")}
                      >
                        {p.year}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* FAST “MIDT”-OMRÅDE: viser kun ett prosjekt om gangen */}
          <div className="relative h-[70vh]">
            {leavingProject && (
              <article
                className={[
                  "absolute inset-0 will-change-transform",
                  "transition-[transform,opacity,filter] ease-[cubic-bezier(0.22,1,0.36,1)]",
                ].join(" ")}
                style={{
                  ...transitionStyle,
                  ...(leaving?.phase === "start" ? enterToStyle : leaveToStyle),
                }}
                aria-hidden="true"
              >
                <ProjectCard project={leavingProject} />
              </article>
            )}

            <article
              className={[
                "absolute inset-0 will-change-transform",
                "transition-[transform,opacity,filter] ease-[cubic-bezier(0.22,1,0.36,1)]",
              ].join(" ")}
              style={{
                ...transitionStyle,
                ...(enteringPhase === "from" ? enterFromStyle : enterToStyle),
              }}
            >
              <ProjectCard project={active} />
            </article>
          </div>

          {/* (Valgfritt) liten “nå viser vi…”-label */}
          <div className="mt-4 text-center text-xs uppercase tracking-[0.35em] text-ink/50">
            {active?.year} · {activeCopy?.title}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: ProjectItem }) {
  const { t, i18n } = useTranslation();
  const copy = getProjectCopy(project, i18n.resolvedLanguage ?? i18n.language);
  const [shiftPreviewLabel, setShiftPreviewLabel] = useState(false);
  const buttons =
    copy.buttons && copy.buttons.length > 0
      ? copy.buttons
      : project.link && copy.linkLabel
        ? [{ href: project.link, label: copy.linkLabel }]
        : [];
  const previewButton = buttons.find((button) => button.previewUrl);
  const actionButtons = buttons.filter((button) => !button.previewUrl);

  useEffect(() => {
    if (!previewButton?.previewUrl) return;
    setShiftPreviewLabel(false);
    const timer = window.setTimeout(() => {
      setShiftPreviewLabel(true);
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [previewButton?.previewUrl]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-sand/80 bg-white/85 shadow-card backdrop-blur">
      {/*Live preview av nettside*/}
      {previewButton?.previewUrl ? (
        <div className="relative">
          {/* Tekst som viser at siden er i preview */}
          <p
            className={[
              "absolute rounded-full border border-sand/80 bg-black/90 px-2 text-[0.9rem] tracking-[0.35em] text-paper transition-all duration-500",
              shiftPreviewLabel ? "top-0 left-2 p-0" : "top-20 left-1/2 -translate-x-1/2 p-3",
            ].join(" ")}
          >
            {t("projectPage.preview_label")}
          </p>
          <iframe
            className="h-[40vh] w-full bg-white"
            src={previewButton.previewUrl}
            title={`${copy.title} preview`}
          />
        </div>

      ) : (
        <img
          className="w-full h-[40vh] object-cover"
          src={getProjectImageSrc(project.img)}
          alt={project.imgAlt ?? copy.title}
        />
      )}

      {/* År + språk */}
      <div className="flex flex-1 flex-col px-6 py-5 sm:px-8 sm:py-6">
        <span className="tracking-[0.35em] text-ink/50 flex justify-between gap-10">
          <p>
            {project.year}
          </p>
          <p>
            {project.languages ? project.languages : ""}
          </p>
        </span>

        <h2 className="mt-3 font-display text-2xl sm:text-3xl">
          {copy.title}
        </h2>
        <p className="mt-3 text-sm text-ink/70 sm:text-base">
          {copy.description}
        </p>
        {actionButtons.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            {actionButtons.map((button) => (
              <a
                key={`${project.id}-${button.href}-${button.label}`}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-ink/90"
                href={button.href}
                aria-label={button.ariaLabel}
                rel="noreferrer"
                target="_blank"
              >
                {button.label}
                <span aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div >
  );
}

export default ProjectPage;
