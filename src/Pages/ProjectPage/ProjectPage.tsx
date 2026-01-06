import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../../components/pageSections/Header";
import Footer from "../../components/pageSections/Footer";
import Button from "../../components/elements/Button";
import noImg from "../../assets/ProjectImages/noimg.avif";

import {
  PROJECTS,
  START_PROJECT_INDEX,
  SCROLL_VH_PER_PROJECT,
  sortProjects,
  useProjectScroll,
  type ProjectItem,
  type ProjectCopy,
  type LocalizedString,
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
  return project.content[key] ?? project.content.en;
};

const getLocalizedValue = (
  value: LocalizedString | undefined,
  language: string | undefined
) => {
  const key = language?.startsWith("no") ? "no" : "en";
  return value?.[key] ?? value?.en ?? value?.no ?? "";
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
    progress,
    scrollToIndex,
  } = useProjectScroll(projects, START_PROJECT_INDEX);

  const active = projects[activeIndex] ?? projects[0];
  const activeCopy = active
    ? getProjectCopy(active, i18n.resolvedLanguage ?? i18n.language)
    : null;
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
            <article className="absolute inset-0">
              <ProjectCard project={active} />
            </article>
          </div>

        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: ProjectItem }) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const copy = getProjectCopy(project, language);
  const [shiftPreviewLabel, setShiftPreviewLabel] = useState(false);
  const localizedButtons = (project.buttons ?? []).map((button) => {
    const ariaLabel = getLocalizedValue(button.ariaLabel, language);
    return {
      href: button.href,
      previewUrl: button.previewUrl,
      label: getLocalizedValue(button.label, language),
      ariaLabel: ariaLabel || undefined,
    };
  });
  const buttons: Array<{
    href?: string;
    previewUrl?: string;
    label: string;
    ariaLabel?: string;
  }> =
    localizedButtons.length > 0
      ? localizedButtons
      : project.link && copy.linkLabel
        ? [{ href: project.link, label: copy.linkLabel, ariaLabel: undefined }]
        : [];
  const previewButton = buttons.find((button) => button.previewUrl);
  const actionButtons = buttons.filter(
    (button) => !button.previewUrl && button.label
  );

  // Timer for å flytte på preview-label etter 2 sekunder
  useEffect(() => {
    if (!previewButton?.previewUrl) return;
    setShiftPreviewLabel(false);
    const timer = window.setTimeout(() => {
      setShiftPreviewLabel(true);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [previewButton?.previewUrl]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-sand/80 bg-white/85 shadow-card backdrop-blur">
      {/*Live preview av nettside*/}
      {previewButton?.previewUrl ? (
        <div className="relative">
          {/* Tekst som viser at siden er i preview */}
          <div
            className={[
              "absolute rounded-xl flex items-center flex-col border border-sand/80 top-20 left-1/2 -translate-x-1/2 p-3 bg-black/90 px-2 text-[0.9rem] tracking-[0.35em] text-paper transition-opacity duration-500",
              shiftPreviewLabel ? "opacity-0 pointer-events-none" : "opacity-100",
            ].join(" ")}
          >
            <span className="block">{t("projectPage.preview_label_top")}</span>
            <span className="block text-[0.75rem] tracking-[0.25em] text-paper/80">
              {t("projectPage.preview_label_bottom")}
            </span>
          </div>
          <iframe
            className="h-[40vh] w-full bg-white [@media(max-height:760px)]:h-[32vh] [@media(max-height:640px)]:h-[26vh]"
            src={previewButton.previewUrl}
            title={`${copy.title} preview`}
          />
        </div>

      ) : (
        <img
          className="h-[40vh] w-full object-cover [@media(max-height:760px)]:h-[32vh] [@media(max-height:640px)]:h-[26vh]"
          src={getProjectImageSrc(project.img)}
          alt={project.imgAlt ?? copy.title}
        />
      )}

      <div className="flex flex-1 min-h-0 flex-col px-6 py-5 sm:px-8 sm:py-6 [@media(max-height:760px)]:py-4 [@media(max-height:640px)]:py-3">
        <span className="hidden tracking-[0.35em] text-ink/50 sm:flex justify-between gap-100">
          <p>
            {project.year}
          </p>
          <p>
            {project.languages ? project.languages : ""}
          </p>
        </span>

        {/* Title */}
        <h2 className="mt-3 font-display text-2xl sm:text-3xl [@media(max-height:760px)]:mt-2 [@media(max-height:640px)]:text-xl">
          {copy.title}
        </h2>
        {/* Description */}
        <p className="mt-2 flex-1 min-h-0 overflow-y-auto pr-1 text-sm text-ink/70 sm:text-base [@media(max-height:760px)]:mt-1 [@media(max-height:760px)]:text-sm [@media(max-height:760px)]:leading-snug [@media(max-height:640px)]:text-[0.85rem] [@media(max-height:640px)]:leading-snug">
          {copy.description}
        </p>
        {actionButtons.length > 0 && (
          <div className="mt-auto flex flex-nowrap gap-2 pt-4 sm:flex-wrap sm:gap-3 [@media(max-height:760px)]:gap-2 [@media(max-height:760px)]:pt-3 [@media(max-height:640px)]:pt-2">
            {actionButtons.map((button) => (
              <Button
                key={`${project.id}-${button.href}-${button.label}`}
                href={button.href}
                aria-label={button.ariaLabel}
                rel="noreferrer"
                target="_blank"
                className="min-w-0 shrink justify-center whitespace-nowrap [@media(max-height:760px)]:px-4 [@media(max-height:760px)]:py-3 [@media(max-height:760px)]:text-[0.65rem] [@media(max-height:760px)]:tracking-[0.1em] [@media(max-height:640px)]:px-3 [@media(max-height:640px)]:py-2 [@media(max-height:640px)]:text-[0.6rem] [@media(max-height:640px)]:tracking-[0.08em]"
              >
                <span className="min-w-0 truncate">{button.label}</span>
                <span aria-hidden="true" className="flex-shrink-0">→</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div >
  );
}

export default ProjectPage;
