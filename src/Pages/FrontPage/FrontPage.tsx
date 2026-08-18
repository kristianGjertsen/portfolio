import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import PageButton from "../../components/elements/PageButton";
import Layout from "../../components/elements/Layout";

import "./animateFrontPage.css";

import bg_noIcon from "../../assets/back3_overlay_fill.png";
import lineOnly from "../../assets/back3LineOnly.png";

type FrontPageProps = {
    startLineAnimation?: boolean;
};

const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve) => {
        const image = new Image();

        const done = () => resolve();

        image.onload = done;
        image.onerror = done;
        image.src = src;

        if (image.complete) {
            if (typeof image.decode === "function") {
                image.decode().catch(() => undefined).finally(done);
            } else {
                done();
            }
        }
    });
};

function FrontPage({
    startLineAnimation = true,
}: FrontPageProps) {
    const { t } = useTranslation();

    const [canAnimate, setCanAnimate] = useState(false);

    useEffect(() => {
        if (!startLineAnimation) {
            return;
        }

        let cancelled = false;
        let frame1 = 0;
        let frame2 = 0;

        const prepareAnimation = async () => {
            await Promise.all([
                preloadImage(bg_noIcon),
                preloadImage(lineOnly),
            ]);

            if (cancelled) return;

            frame1 = requestAnimationFrame(() => {
                frame2 = requestAnimationFrame(() => {
                    if (!cancelled) {
                        setCanAnimate(true);
                    }
                });
            });
        };

        prepareAnimation();

        return () => {
            cancelled = true;
            cancelAnimationFrame(frame1);
            cancelAnimationFrame(frame2);
        };
    }, [startLineAnimation]);

    return (
        <Layout
            className={`frontpage relative flex min-h-[100dvh] flex-col bg-[#d1e0ec] text-ink ${startLineAnimation && canAnimate ? "is-loaded" : ""}`}
            mainClassName="relative flex flex-1 items-center justify-center px-3 py-3 text-center sm:px-6 sm:py-8"
        >
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage: `url(${bg_noIcon})`,
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                }}
            />

            <div className="line-animation pointer-events-none absolute inset-0">
                <div className="line-reveal">
                    <div
                        className="line-reveal-image"
                        style={{
                            backgroundImage: `url(${lineOnly})`,
                            backgroundSize: "100% 100%",
                            backgroundRepeat: "no-repeat",
                        }}
                    />
                </div>
            </div>

            <div className="relative z-10 w-full max-w-2xl rounded-3xl border-4 border-white/50 bg-white/30 p-6 shadow-2xl backdrop-blur-lg sm:border-8 sm:p-14 lg:p-20">
                <p className="text-xs uppercase tracking-[0.4em] text-ink/60">
                    {t("frontpage.tagline")}
                </p>

                <h1 className="mt-6 text-6xl sm:text-6xl lg:text-7xl">
                    {t("frontpage.title")}
                </h1>

                <p className="mt-4 max-w-xl text-lg text-black">
                    {t("frontpage.description")}
                </p>

                <div className="mt-8 grid w-full grid-cols-2 gap-3 min-[520px]:grid-cols-4 sm:gap-4">
                    <PageButton
                        to="/projects"
                        variant="white"
                        label={t("frontpage.cta_project")}
                        className="!min-w-0 !px-3"
                    />

                    <PageButton
                        to="/about"
                        variant="white"
                        label={t("frontpage.cta_about")}
                        className="!min-w-0 !px-3"
                    />

                    <PageButton
                        to="/cv"
                        variant="white"
                        label="CV"
                        className="!min-w-0 !px-3"
                    />

                    <PageButton
                        to="/contact"
                        variant="white"
                        label={t("frontpage.cta_contact")}
                        className="!min-w-0 !px-3"
                    />
                </div>
            </div>
        </Layout>
    );
}

export default FrontPage;
