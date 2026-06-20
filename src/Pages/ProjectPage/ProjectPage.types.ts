export type ProjectCopy = {
  title: string;
  shortText: string;
  longText: string;
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

export type ProjectItem = {
  id: string;
  year: number;
  link?: string;
  languages: string[];
  img?: string;
  imgAlt?: string;
  content: ProjectCopyByLocale;
  buttons?: ProjectButton[];
};

export type ProjectLink = {
  href: string;
  label: string;
  ariaLabel?: string;
};
