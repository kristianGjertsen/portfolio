
import { useTranslation } from "react-i18next";

function FrontPageError() {
    const { t } = useTranslation();

    const brokenMarkup = String.raw`{ <div className="ml-4">
    <nav className="flex items-center gap-4 text-sm">
      <div className="hidden items-center gap-2 md:gap-3 text-[0.8rem] uppercase tracking-[0.25em] text-ink/70 md:flex">
        {navItems.map((item, index) => (
          <div key={item.to} className="flex items-center gap-2 md:gap-3">
            <NavLink className={({ isActive }) => ["relative transition hover:text-ink"].join(" ")} to={item.to}>
              {item.label}
            </NavLink>
          </div>
        ))}
      </div>
      <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full border">
        <span className="flex h-4 w-4 flex-col justify-between">
          <span className="h-[1px] w-full bg-ink" />
          <span className="h-[1px] w-full bg-ink" />
          <span className="h-[1px] w-full bg-ink" />
        </span>
      </button>
    </nav>
  </div>
  {isMenuOpen && (<div className="absolute right-3 top-full mt-3 w-[13rem] rounded-xl border"> ... </div>) } }`;
    const brokenMarkupOneLine = brokenMarkup.replace(/\s+/g, " ").trim();
    return (

        <main className="bg-red-200">
            <p>{brokenMarkupOneLine}</p>
            <p className="bg-">
                {t("frontpageError.tagline")}
            </p>
            <h1 className="mt-100 text-5xl leading-tight sm:text-6xl lg:text-7xl">
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
    )
}

export default FrontPageError
