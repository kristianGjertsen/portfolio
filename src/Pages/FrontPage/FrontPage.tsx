import { useTranslation } from "react-i18next";
import PageButton from "../../components/elements/PageButton";
import Layout from "../../components/elements/Layout";
//import { HoldButton } from "../../components/elements/HoldButton";
import "./animateFrontPage.css";

import bg_noIcon from '../../assets/back3_overlay_fill.png'
import lineOnly from '../../assets/back3LineOnly.png'

/*
const handleRestartIntro = () => {
    localStorage.removeItem("intro_seen");
    window.location.assign("/");
};
*/
function FrontPage() {


    const { t } = useTranslation();
    return (
        <Layout
            className="relative flex min-h-[100svh] flex-col bg-[#d1e0ec] text-ink"
            mainClassName="relative flex flex-1 items-center justify-center px-6 py-6 text-center sm:py-8">
            <div
                className="pointer-events-none absolute inset-0"
                style={{ backgroundImage: `url(${bg_noIcon})`, backgroundSize: "100% 100%" }}
            />
            <div
                className="pointer-events-none absolute inset-0 animate-slide"
                style={{ backgroundImage: `url(${lineOnly})`, backgroundSize: "100% 100%" }} />

            <div className="relative z-10 backdrop-blur-lg rounded-3xl p-20 border-8 border-white/50 shadow-2xl bg-white/30">
                {/*
                <HoldButton
                    className="mb-2"
                    onComplete={handleRestartIntro}>
                    {t("header.restart_intro")}
                </HoldButton> */}
                <p className="text-xs uppercase tracking-[0.4em] text-ink/60">
                    {t("frontpage.tagline")}
                </p>

                <h1 className="mt-6 text-6xl 
                  sm:text-6xl lg:text-7xl">
                    {t("frontpage.title")}
                </h1>
                <p className=" mt-4 max-w-xl text-lg text-black" >
                    {t("frontpage.description")}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <PageButton to="/projects" variant="white" label={t("frontpage.cta_project")} />
                    <PageButton to="/about" variant="white" label={t("frontpage.cta_about")} />
                    <PageButton to="/cv" variant="white" label="CV" />
                    <PageButton to="/contact" variant="white" label={t("frontpage.cta_contact")} />
                </div>

            </div>

        </Layout >
    )
}

export default FrontPage
