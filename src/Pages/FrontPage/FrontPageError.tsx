
import { useTranslation } from "react-i18next";

function FrontPageError() {
    const { t } = useTranslation();

    return (
        <div className="">
            <div className="" />
            <div className="" />
            <div className="" />

            <main className="bg-red-200">
                <p className="bg-">
                    {t("frontpageError.tagline")}
                </p>
                <h1 className="mt-100 font-display text-5xl leading-tight sm:text-6xl lg:text-7xl">
                    {t("frontpageError.title")}
                </h1>
                <p className="mt-4 max-w-xl text-lg text-ink/70">
                    {t("frontpageError.description")}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <div className="bg-gray-600">{t("frontpageError.cta_contact")}</div>
                    <div className="bg-gray-600 border-10 border-rounded">
                        {t("frontpageError.cta_project")}
                    </div>
                </div>
            </main >
        </div >
    )
}

export default FrontPageError
