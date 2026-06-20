import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../../components/elements/Layout";
import ProjectBigCard from "./ProjectBigCard";
import ProjectSmallCard from "./ProjectSmallCard";
import type { ProjectItem } from "./ProjectPage.types";
import {
  getAllProjectLanguages,
  PROJECTS,
} from "./ProjectPage.utils";

type SortOption = "newest" | "oldest";

function ProjectPage() {
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isLanguageFilterOpen, setIsLanguageFilterOpen] = useState(false);
  const languageFilterRef = useRef<HTMLDivElement | null>(null);

  const availableLanguages = useMemo(
    () => getAllProjectLanguages(PROJECTS),
    []
  );
  const projectOrder = useMemo(
    () => new Map(PROJECTS.map((project, index) => [project.id, index])),
    []
  );

  const filteredProjects = useMemo(() => {
    return [...PROJECTS]
      .filter((project) => {
        return (
          selectedLanguages.length === 0 ||
          selectedLanguages.every((entry) => project.languages.includes(entry))
        );
      })
      .sort((a, b) => {
        const yearDiff = sortBy === "oldest" ? a.year - b.year : b.year - a.year;
        if (yearDiff !== 0) return yearDiff;
        return (projectOrder.get(a.id) ?? 0) - (projectOrder.get(b.id) ?? 0);
      });
  }, [projectOrder, selectedLanguages, sortBy]);

  const toggleLanguage = (entry: string) => {
    setSelectedLanguages((current) =>
      current.includes(entry)
        ? current.filter((value) => value !== entry)
        : [...current, entry]
    );
  };

  const clearFilters = () => {
    setSelectedLanguages([]);
    setSortBy("newest");
    setIsLanguageFilterOpen(false);
  };

  useEffect(() => {
    if (!isLanguageFilterOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!languageFilterRef.current?.contains(event.target as Node)) {
        setIsLanguageFilterOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isLanguageFilterOpen]);

  return (
    <Layout className="relative min-h-screen bg-paper text-ink">
      <section className="mx-auto w-full max-w-6xl px-6 pt-12 pb-10">
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

      <section className="mx-auto w-full max-w-6xl px-6 pb-8">
        <div className="rounded-[1.75rem] border border-sand/80 bg-white/90 p-5 shadow-card">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[0.7rem] uppercase tracking-[0.32em] text-ink/55">
              {t("projectPage.sort_label")}
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSortBy("newest")}
                aria-pressed={sortBy === "newest"}
                aria-label={t("projectPage.sort_newest")}
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-xl border text-sm transition",
                  sortBy === "newest"
                    ? "border-ink bg-ink text-paper"
                    : "border-sand/80 bg-paper text-ink/70 hover:border-ink/40 hover:text-ink",
                ].join(" ")}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 13V3" />
                  <path d="M4.5 6.5 8 3l3.5 3.5" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setSortBy("oldest")}
                aria-pressed={sortBy === "oldest"}
                aria-label={t("projectPage.sort_oldest")}
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-xl border text-sm transition",
                  sortBy === "oldest"
                    ? "border-ink bg-ink text-paper"
                    : "border-sand/80 bg-paper text-ink/70 hover:border-ink/40 hover:text-ink",
                ].join(" ")}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 3v10" />
                  <path d="m4.5 9.5 3.5 3.5 3.5-3.5" />
                </svg>
              </button>
            </div>

            <div
              ref={languageFilterRef}
              className="relative min-w-0 flex-1 sm:max-w-sm"
            >
              <button
                type="button"
                onClick={() => setIsLanguageFilterOpen((current) => !current)}
                aria-expanded={isLanguageFilterOpen}
                aria-haspopup="true"
                className="flex h-9 w-full items-center justify-between rounded-xl border border-sand/80 bg-paper px-3 py-2 text-left text-sm text-ink transition hover:border-ink/40"
              >
                <span className="truncate text-ink/80">
                  {selectedLanguages.length > 0
                    ? selectedLanguages.join(", ")
                    : t("projectPage.filter_languages")}
                </span>
                <span className="ml-3 text-xs text-ink/55">
                  {isLanguageFilterOpen ? "-" : "+"}
                </span>
              </button>

              {isLanguageFilterOpen ? (
                <div className="absolute left-0 top-full z-20 mt-2 w-full rounded-2xl border border-sand/80 bg-white p-2 shadow-card">
                  <div className="flex max-h-64 flex-col overflow-y-auto">
                    {availableLanguages.map((entry) => {
                      const isSelected = selectedLanguages.includes(entry);

                      return (
                        <label
                          key={entry}
                          className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm text-ink/80 transition hover:bg-paper"
                        >
                          <span>{entry}</span>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleLanguage(entry)}
                            className="h-4 w-4 accent-ink"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto text-[0.7rem] uppercase tracking-[0.28em] text-ink/60 transition hover:text-ink"
            >
              {t("projectPage.clear_filters")}
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-wrap gap-6 px-6 pb-24">
        {filteredProjects.map((project) => (
          <ProjectSmallCard
            key={project.id}
            project={project}
            onOpen={() => setSelectedProject(project)}
          />
        ))}

        {filteredProjects.length === 0 ? (
          <div className="w-full rounded-[1.75rem] border border-dashed border-sand/80 bg-white/70 px-6 py-10 text-center text-sm text-ink/65">
            {t("projectPage.no_results")}
          </div>
        ) : null}
      </section>

      {selectedProject ? (
        <ProjectBigCard
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      ) : null}
    </Layout>
  );
}

export default ProjectPage;
