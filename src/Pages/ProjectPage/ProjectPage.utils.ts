import noImg from "../../assets/ProjectImages/noimg.avif";
import projectData from "./projects.json";
import type {
  LocalizedString,
  ProjectCopy,
  ProjectItem,
  ProjectLink,
} from "./ProjectPage.types";

const projectImages = import.meta.glob("../../assets/ProjectImages/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export const PROJECTS = [...(projectData as ProjectItem[])].sort(
  (a, b) => a.year - b.year
);

export const getProjectImageSrc = (img?: string) => {
  if (!img) return noImg;
  return projectImages[`../../assets/ProjectImages/${img}`] ?? noImg;
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
