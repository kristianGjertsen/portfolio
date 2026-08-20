import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useTranslation } from "react-i18next";
import Button from "../../components/elements/Button";

import Layout from "../../components/elements/Layout";

import CvEng from "./CvFiles/Kristian_Gjertsen_CV.Eng.pdf";
import CvNo from "./CvFiles/Kristian_Gjertsen_CV.No.pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

function Cv() {
    const { i18n, t } = useTranslation("cv");

    const cvSrc = i18n.language === "no" ? CvNo : CvEng;

    const [numPages, setNumPages] = useState<number>(0);
    const [pageWidth, setPageWidth] = useState(800);

    useEffect(() => {
        const updateWidth = () => {
            const availableWidth = window.innerWidth - 48;
            setPageWidth(Math.min(800, availableWidth));
        };

        updateWidth();

        window.addEventListener("resize", updateWidth);

        return () => {
            window.removeEventListener("resize", updateWidth);
        };
    }, []);

    return (
        <Layout
            className="relative flex min-h-[100svh] flex-col bg-paper text-ink"
            mainClassName="relative flex justify-center px-4 py-10 sm:px-6"
        >
            <section className="flex w-full max-w-5xl flex-col items-center">
                <div className="mb-6 flex w-full max-w-[800px] items-center justify-between gap-4">
                    <p className="text-sm uppercase tracking-[0.3em] text-ink/60">
                        {t("description")}
                    </p>

                    <div className="flex shrink-0 gap-2">
                        <Button
                            href={cvSrc}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {t("button_text")}
                        </Button>

                        <Button
                            href={cvSrc}
                            download
                        >
                            {t("download_button_text")}
                        </Button>
                    </div>
                </div>

                <Document
                    file={cvSrc}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    loading={
                        <div className="py-20 text-sm text-ink/50">
                            {t("loading")}
                        </div>
                    }
                    error={
                        <div className="py-20 text-center">
                            <p className="mb-4 text-sm text-ink/60">
                                {t("error")}
                            </p>

                            <a
                                href={cvSrc}
                                target="_blank"
                                rel="noreferrer"
                                className="underline underline-offset-4"
                            >
                                {t("open_pdf")}
                            </a>
                        </div>
                    }
                    className="flex w-full flex-col items-center gap-6"
                >
                    {Array.from(
                        { length: numPages },
                        (_, index) => index + 1
                    ).map((pageNumber) => (
                        <div
                            key={pageNumber}
                            className="overflow-hidden rounded-md bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                        >
                            <Page
                                pageNumber={pageNumber}
                                width={pageWidth}
                                renderAnnotationLayer
                                renderTextLayer
                            />
                        </div>
                    ))}
                </Document>
            </section>
        </Layout>
    );
}

export default Cv;
