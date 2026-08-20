import { useTranslation } from "react-i18next";
import Layout from "../../components/elements/Layout";
import PageButton from "../../components/elements/PageButton";

function About() {
    const { t } = useTranslation();
    const sections = t("about.sections", { returnObjects: true }) as {
        label: string;
        title: string;
        text: string;
    }[];
    const [education, studentRole, soleProprietorship] = sections;

    return (
        <Layout className="relative flex min-h-[100svh] flex-col bg-paper text-ink">
            <section className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-16">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl">
                    {t("about.title")}
                </h1>
                <p className="mt-4 max-w-3xl text-base text-ink/70 sm:text-lg">
                    {t("about.lead")}
                </p>

                <div className="mt-12 grid gap-6 lg:grid-cols-2">
                    <section className="rounded-3xl border border-sand/80 bg-white/85 p-6 shadow-card lg:col-span-2">
                        <p className="text-sm uppercase tracking-[0.24em]">
                            {education.label}
                        </p>
                        <h2 className="mt-5 text-2xl sm:text-3xl">
                            {education.title}
                        </h2>
                        <p className="mt-6 max-w-3xl text-base leading-relaxed">
                            {education.text}
                        </p>
                    </section>

                    {[studentRole, soleProprietorship].map((section) => (
                        <section
                            key={section.title}
                            className="flex min-h-64 flex-col rounded-3xl border border-sand/80 bg-white/85 p-6 shadow-card"
                        >
                            <p className="text-sm uppercase tracking-[0.24em]">
                                {section.label}
                            </p>
                            <h2 className="mt-5 text-2xl sm:text-3xl">
                                {section.title}
                            </h2>
                            <p className="mt-6 text-base leading-relaxed">
                                {section.text}
                            </p>
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
