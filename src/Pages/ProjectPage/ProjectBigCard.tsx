import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../components/elements/Button";
import type { ProjectItem } from "./ProjectPage.types";
import {
  formatProjectLanguages,
  getProjectCopy,
  getProjectImageSrc,
  getProjectLinks,
  getProjectPreviewUrl,
} from "./ProjectPage.utils";

type ProjectBigCardProps = {
  project: ProjectItem;
  onClose: () => void;
};

function ProjectBigCard({ project, onClose }: ProjectBigCardProps) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const copy = getProjectCopy(project, language);
  const links = getProjectLinks(project, language, copy);
  const previewUrl = getProjectPreviewUrl(project);
  const closeLabel = language?.startsWith("no") ? "Lukk" : "Close";
  const closeAriaLabel =
    language?.startsWith("no") ? "Lukk prosjektinformasjon" : "Close project details";

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const activeElement = document.activeElement;

    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/65 px-4 py-8"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-sand/80 bg-white shadow-card"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`project-modal-title-${project.id}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-sand/80 px-6 py-5 sm:px-8">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.32em] text-ink/55">
              {project.year}
              {project.languages.length > 0
                ? ` - ${formatProjectLanguages(project.languages)}`
                : ""}
            </p>
            <h2
              id={`project-modal-title-${project.id}`}
              className="mt-3 font-display text-3xl sm:text-4xl"
            >
              {copy.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-sand/80 px-4 py-2 text-xs uppercase tracking-[0.3em] text-ink/70"
            aria-label={closeAriaLabel}
          >
            {closeLabel}
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="px-4 pt-4 sm:px-6">
            <div className="flex items-center justify-center overflow-hidden rounded-2xl">
              {previewUrl ? (
                <iframe
                  className="h-[52vh] w-full bg-white rounded-2xl border border-sand/80"
                  src={previewUrl}
                  title={`${copy.title} preview`}
                />
              ) : (
                <img
                  className=" w-full object-contain border border-sand/80 rounded-2xl"
                  src={getProjectImageSrc(project.img)}
                  alt={project.imgAlt ?? copy.title}
                />
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col px-6 py-6 sm:px-8">
            <p className="text-sm leading-relaxed text-ink/75 sm:text-base">
              {copy.longText}
            </p>

            {links.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-3 border-t border-sand/80 pt-6">
                {links.map((link) => (
                  <Button
                    key={`${project.id}-${link.href}-${link.label}`}
                    href={link.href}
                    aria-label={link.ariaLabel}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {link.label}
                  </Button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectBigCard;
