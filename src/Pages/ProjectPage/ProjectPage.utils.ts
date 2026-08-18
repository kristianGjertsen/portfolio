import builderImg from "../../assets/ProjectImages/Builder.png";
import dotdageneImg from "../../assets/ProjectImages/dotdagene.png";
import noImg from "../../assets/ProjectImages/noimg.avif";
import rotatePlatformImg from "../../assets/ProjectImages/RotatePlatform.png";
import fallbackProjectData from "./projects.json";
import generatedProjectData from "./projects.generated.json";
import type {
  LocalizedString,
  ProjectCopy,
  ProjectItem,
  ProjectLink,
} from "./ProjectPage.types";

export const PROJECT_IMAGE_FALLBACK_SRC = noImg;

const fallbackProjectImages: Record<string, string> = {
  "Builder.png": builderImg,
  "RotatePlatform.png": rotatePlatformImg,
  "dotdagene.png": dotdageneImg,
};

const mergeProjects = (
  generatedProjects: ProjectItem[],
  fallbackProjects: ProjectItem[]
) => {
  const projects = [...generatedProjects];
  const projectIds = new Set(projects.map((project) => project.id));

  for (const project of fallbackProjects) {
    if (!projectIds.has(project.id)) {
      projects.push(project);
      projectIds.add(project.id);
    }
  }

  return projects;
};

export const PROJECTS = mergeProjects(
  generatedProjectData as ProjectItem[],
  fallbackProjectData as ProjectItem[]
).sort(
  (a, b) => a.year - b.year
);

export const getProjectImageSrc = (img?: string) => {
  if (!img) return noImg;
  return fallbackProjectImages[img] ?? img;
};

export const getProjectCopy = (
  project: ProjectItem,
  language: string | undefined
): ProjectCopy => {
  const key = language?.startsWith("no") ? "no" : "en";
  return project.content[key] ?? project.content.en;
};

export const getLocalizedValue = (
  value: LocalizedString | undefined,
  language: string | undefined
) => {
  const key = language?.startsWith("no") ? "no" : "en";
  return value?.[key] ?? value?.en ?? value?.no ?? "";
};

export const getProjectLinks = (
  project: ProjectItem,
  language: string | undefined,
  copy: ProjectCopy
): ProjectLink[] => {
  const localizedButtons = (project.buttons ?? []).flatMap((button) => {
    if (!button.href) return [];

    const label = getLocalizedValue(button.label, language);
    if (!label) return [];

    const ariaLabel = getLocalizedValue(button.ariaLabel, language);

    return [
      {
        href: button.href,
        label,
        ariaLabel: ariaLabel || undefined,
      },
    ];
  });

  if (localizedButtons.length > 0) {
    return localizedButtons;
  }

  if (project.link && copy.linkLabel) {
    return [{ href: project.link, label: copy.linkLabel, ariaLabel: undefined }];
  }

  return [];
};

export const getProjectPreviewUrl = (project: ProjectItem) =>
  project.buttons?.find((button) => button.previewUrl)?.previewUrl;

export const formatProjectLanguages = (languages: string[]) =>
  languages.join(" / ");

export const getAllProjectLanguages = (projects: ProjectItem[]) =>
  [...new Set(projects.flatMap((project) => project.languages))].sort((a, b) =>
    a.localeCompare(b)
  );
