import { Link } from "react-router-dom";
import { HoldButton } from "../elements/HoldButton";
import { useTranslation } from "react-i18next";
import norwayFlag from "../../assets/LanguageImages/Norway.png";
import ukFlag from "../../assets/LanguageImages/UK.png";

function Header() {
  const handleRestartIntro = () => {
    localStorage.removeItem("intro_seen");
    window.location.assign("/");
  };

  const { t, i18n } = useTranslation();

  return (
    <header className="flex items-center justify-between px-6 py-4 text-ink">
      {/* Venstre side */}
      <div className=" flex gap-10">
        <Link
          to="/"
          className="text-sm font-semibold uppercase tracking-[0.3em]">
          Kristian Gjertsen
        </Link>
        <div className="flex gap-2">
          <button
            aria-label="Switch to Norwegian"
            onClick={() => {
              i18n.changeLanguage("no")
              window.localStorage.setItem("language", "no");
            }} type="button">
            <img
              alt="Norwegian flag"
              className={`h-6 w-6 rounded-full object-cover ring-1 ring-ink/50 transition hover:scale-120 ${i18n.language === "no" ? "" : "saturate-50 opacity-70"}`}
              src={norwayFlag} />
          </button>
          <button
            aria-label="Switch to English"
            onClick={() => {
              i18n.changeLanguage("en")
              window.localStorage.setItem("language", "en");
            }}
            type="button">
            <img
              alt="UK flag"
              className={`h-6 w-6 rounded-full object-cover ring-1 ring-ink/50 transition hover:scale-120 ${i18n.language === "en" ? "" : "saturate-50 opacity-70"}`}
              src={ukFlag} />
          </button>
        </div>

      </div>


      {/* Høyre side */}
      <div>
        <nav className="flex items-center gap-4 text-sm">
          <HoldButton onComplete={handleRestartIntro}>
            {t("header.restart_intro")}
          </HoldButton>

          <Link className="transition hover:text-ink/70" to="/project">
            {t("header.project")}
          </Link>
          <Link className="transition hover:text-ink/70" to="/contact">
            {t("header.contact")}
          </Link>
        </nav>
      </div>


    </header >
  );
}

export default Header;
