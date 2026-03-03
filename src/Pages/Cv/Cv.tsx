import Layout from "../../components/elements/Layout";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import CvEng from "../../assets/CvFiles/Kristian_Gjertsen_CV.Eng.pdf";
import CvNo from "../../assets/CvFiles/Kristian_Gjertsen_CV.No.pdf";

function Cv() {
    const { i18n, t } = useTranslation();
    const cvSrc = `${i18n.language === "no" ? CvNo : CvEng}#view=FitH`;
    const [openedOnMobile, setOpenedOnMobile] = useState(false);

    useEffect(() => {
        if (openedOnMobile) {
            return;
        }
        const isMobile = window.matchMedia("(max-width: 640px)").matches;
        if (!isMobile) {
            return;
        }
        window.open(cvSrc, "_blank", "noopener,noreferrer");
        setOpenedOnMobile(true);
    }, [cvSrc, openedOnMobile]);

    return (
        <Layout
            className="relative flex min-h-[100svh] flex-col bg-paper text-ink"
            mainClassName="relative flex items-center justify-center px-4 py-6"
        >
            <section className="w-full max-w-4xl p-4">
                {openedOnMobile ? (
                    <div className="flex flex-col items-center gap-4 text-center">
                        <p className="text-sm uppercase tracking-[0.3em] text-ink/60">
                            {t("cv.description")}
                        </p>
                        <a
                            className="rounded-full border border-ink/40 px-5 py-3 text-sm uppercase tracking-[0.2em] transition hover:bg-ink hover:text-paper"
                            href={cvSrc}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {t("cv.button_text")}
                        </a>
                    </div>
                ) : (
                    <div className="h-[80svh] w-full sm:h-[85vh]">
                        <iframe
                            src={cvSrc}
                            className="h-full w-full rounded-md border"
                            title="CV PDF"
                        />
                    </div>
                )}
            </section>
        </Layout>
    );
}

export default Cv
