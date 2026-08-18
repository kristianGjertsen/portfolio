import { useTranslation } from "react-i18next";
import Layout from "../../components/elements/Layout";
import PageButton from "../../components/elements/PageButton";

function About() {
    const { t } = useTranslation();
    const sections = t("about.sections", { returnObjects: true }) as {
        label: string;
        title: string;
        meta: string;
        text: string;
        points: string[];
    }[];

    return (
        <Layout className="relative flex min-h-[100svh] flex-col bg-paper text-ink">
            <section className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-16">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl">
                    {t("about.title")}
                </h1>
                <p className="mt-4 max-w-3xl text-base text-ink/70 sm:text-lg">
                    {t("about.lead")}
                </p>

                <div className="mt-12 grid gap-6">
                    {sections.map((section, index) => (
                        <section
                            key={section.title}
                            className=" rounded-3xl border border-sand/80 bg-white/85 p-6 shadow-card"
                        >
                            
                            <div>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                    <h2 className="text-2xl sm:text-3xl">
                                        {section.title}
                                    </h2>
                                    <p className="text-sm text-ink/55">
                                        {section.meta}
                                    </p>
                                </div>

                                <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/75">
                                    {section.text}
                                </p>

                                <ul className="mt-6 grid gap-3">
                                    {section.points.map((point) => (
                                        <li
                                            key={point}
                                            className="flex gap-3 text-sm leading-relaxed text-ink/75 sm:text-base"
                                        >
                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    ))}
                </div>

                <div className="mt-10 flex flex-wrap gap-4">
                    <PageButton to="/contact" label={t("about.contact_cta")} />
                    <PageButton to="/projects" label={t("about.projects_cta")} />
                </div>
            </section>
        </Layout>
    );
}

export default About;
