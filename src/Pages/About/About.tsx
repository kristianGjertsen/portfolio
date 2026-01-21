import { useTranslation } from "react-i18next";
import Header from "../../components/pageSections/Header";
import Footer from "../../components/pageSections/Footer";
import PageButton from "../../components/elements/PageButton";

function About() {
    const { t } = useTranslation();
    const paragraphs = t("about.body", { returnObjects: true }) as string[];

    return (
        <div className="relative flex min-h-[100svh] flex-col bg-paper text-ink">
            <Header />

            <main className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-16">
                <p className="text-xs uppercase tracking-[0.35em] text-ink/60">
                    {t("about.tagline")}
                </p>
                <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl">
                    {t("about.title")}
                </h1>
                <p className="mt-4 max-w-3xl text-base text-ink/70 sm:text-lg">
                    {t("about.lead")}
                </p>

                <div className="mt-10 grid gap-6 rounded-3xl border border-sand/80 bg-white/80 p-6 shadow-card backdrop-blur sm:p-8">
                    {paragraphs.map((paragraph, index) => (
                        <p key={index} className="text-base leading-relaxed text-ink/80 sm:text-lg">
                            {paragraph}
                        </p>
                    ))}
                </div>

                <div className="mt-10 flex flex-wrap gap-4">
                    <PageButton to="/contact" label={t("about.contact_cta")} />
                    <PageButton to="/projects" label={t("about.projects_cta")} />
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default About;
