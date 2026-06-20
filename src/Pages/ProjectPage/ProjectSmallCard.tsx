import { useTranslation } from "react-i18next";
import type { ProjectItem } from "./ProjectPage.types";
import {
  formatProjectLanguages,
  getProjectCopy,
  getProjectImageSrc,
} from "./ProjectPage.utils";

type ProjectSmallCardProps = {
  project: ProjectItem;
  onOpen: () => void;
};

function ProjectSmallCard({ project, onOpen }: ProjectSmallCardProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const copy = getProjectCopy(project, language);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`${t("projectPage.title")}: ${copy.title}`}
      className="flex h-[23rem] w-full flex-col overflow-hidden rounded-[1.75rem] border border-sand/80 bg-white/95 text-left shadow-card md:basis-[calc((100%_-_1.5rem)/2)] md:max-w-[calc((100%_-_1.5rem)/2)] lg:basis-[calc((100%_-_3rem)/3)] lg:max-w-[calc((100%_-_3rem)/3)]"
    >
      <div className="flex h-52 items-center justify-center overflow-hidden rounded-xl bg-paper/70 p-3">
        <img
          className="h-full w-full object-contain"
          src={getProjectImageSrc(project.img)}
          alt={project.imgAlt ?? copy.title}
        />
      </div>

      <div className="flex flex-1 flex-col px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.65rem] uppercase tracking-[0.28em] text-ink/55">
          <span>{project.year}</span>
          <span>{formatProjectLanguages(project.languages)}</span>
        </div>

        <h2 className="mt-2 font-display text-xl leading-tight">{copy.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/70">
          {copy.shortText}
        </p>
      </div>
    </button>
  );
}

export default ProjectSmallCard;
