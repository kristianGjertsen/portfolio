import { useTranslation } from "react-i18next";
import PageButton from "../../components/elements/PageButton";
import Header from "../../components/pageSections/Header";
import Footer from "../../components/pageSections/Footer";

function FrontPage() {
    const { t } = useTranslation();
    return (
        <div className="relative flex h-screen flex-col overflow-hidden bg-paper text-ink">
            <Header />
            <main className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-ink/60">
                    {t("frontpage.tagline")}
                </p>
                <h1 className="mt-6 font-display text-5xl leading-tight sm:text-6xl lg:text-7xl">
                    {t("frontpage.title")}
                </h1>
                <p className="mt-4 max-w-xl text-lg text-ink/70">
                    {t("frontpage.description")}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <PageButton to="/contact" label={t("frontpage.cta_contact")} />
                    <PageButton to="/project" label={t("frontpage.cta_project")} />
                    <PageButton
                        to="/"
                        label={t("frontpage.cta_back")}
                        className="border border-8 border-red-500"
                    />
                </div>
            </main >
            <Footer />
        </div >
    )
}

export default FrontPage
