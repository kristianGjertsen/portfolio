import { useTranslation } from "react-i18next";
import PageButton from "../../components/elements/PageButton";
import Header from "../../components/pageSections/Header";
import Footer from "../../components/pageSections/Footer";
import { HoldButton } from "../../components/elements/HoldButton";

const handleRestartIntro = () => {
    localStorage.removeItem("intro_seen");
    window.location.assign("/");
};

function FrontPage() {


    const { t } = useTranslation();
    return (
        <div className="relative flex min-h-[100svh] flex-col bg-paper text-ink">
            <Header />


            <main className="relative flex flex-1 flex-col items-center justify-center gap-5 px-6 py-6 text-center sm:gap-6 sm:py-8">
                {/* Restart intro button */}
                <HoldButton
                    className="mb-2"
                    onComplete={handleRestartIntro}>
                    {t("header.restart_intro")}
                </HoldButton>
                <p className="text-xs uppercase tracking-[0.4em] text-ink/60">
                    {t("frontpage.tagline")}
                </p>
                <h1 className="mt-6 text-5xl leading-tight sm:text-6xl lg:text-7xl">
                    {t("frontpage.title")}
                </h1>
                <p className="mt-4 max-w-xl text-lg text-ink/70">
                    {t("frontpage.description")}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <PageButton to="/project" label={t("frontpage.cta_project")} />
                    <PageButton to="/cv" label="CV" />
                    <PageButton to="/contact" label={t("frontpage.cta_contact")} />
                </div>
            </main >
            <Footer />
        </div >
    )
}

export default FrontPage
