import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import norwayFlag from "../../assets/LanguageImages/Norway.png";
import ukFlag from "../../assets/LanguageImages/UK.png";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { t, i18n } = useTranslation();
  const navItems = [
    { to: "/", label: t("header.home") },
    { to: "/projects", label: t("header.project") },
    { to: "/about", label: t("header.about") },
    { to: "/cv", label: "CV" },
    { to: "/contact", label: t("header.contact") },
  ];

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand/70 bg-paper/95 px-6 py-4 text-ink backdrop-blur">
      {/* Venstre side */}
      <div className="flex items-center gap-10">
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
            }}
            type="button"
            className={`h-7 w-7 overflow-hidden rounded-full bg-white ring-1 ring-ink/50 transition hover:scale-120 ${i18n.language === "no" ? "" : "saturate-50 opacity-70"}`}
          >
            <img
              alt="Norwegian flag"
              className="h-full w-full object-cover"
              src={norwayFlag}
            />
          </button>
          <button
            aria-label="Switch to English"
            onClick={() => {
              i18n.changeLanguage("en")
              window.localStorage.setItem("language", "en");
            }}
            type="button"
            className={`h-7 w-7 overflow-hidden rounded-full bg-white ring-1 ring-ink/50 transition hover:scale-120 ${i18n.language === "en" ? "" : "saturate-50 opacity-70"}`}
          >
            <img
              alt="UK flag"
              className="h-full w-full object-cover"
              src={ukFlag}
            />
          </button>
        </div>

      </div>

      {/* Høyre side */}
      <div className="ml-4">
        <nav className="flex items-center gap-4 text-sm">
          {/* Desktop-nav med hover/aktiv underline */}
          <div className="hidden items-center gap-2 md:gap-3 text-[0.8rem] uppercase tracking-[0.25em] text-ink/70 md:flex">
            {navItems.map((item, index) => (
              <div key={item.to} className="flex items-center gap-2 md:gap-3">
                <NavLink
                  className={({ isActive }) =>
                    [
                      "relative transition hover:text-ink",
                      "after:absolute after:left-0 after:-bottom-2 after:h-[1px] after:w-full after:bg-ink/40 after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100",
                      isActive ? "text-ink after:scale-x-100" : "after:scale-x-0",
                    ].join(" ")
                  }
                  to={item.to}
                >
                  {item.label}
                </NavLink>
                {index < navItems.length - 1 && (
                  <span className="h-1 w-1 rounded-full bg-ink/20" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
          {/* Mobil: hamburgermeny */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-sand/80 bg-white/90 text-ink transition hover:bg-white md:hidden"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span className="flex h-4 w-4 flex-col justify-between">
              <span className="h-[1px] w-full bg-ink" />
              <span className="h-[1px] w-full bg-ink" />
              <span className="h-[1px] w-full bg-ink" />
            </span>
          </button>
        </nav>
      </div>

      {isMenuOpen && (
        <div className="absolute right-3 top-full mt-3 w-[13rem] rounded-xl border border-sand/80 bg-white p-4 text-[0.75rem] uppercase tracking-[0.25em] text-ink/80 shadow-card backdrop-blur md:hidden">
          {/* Mobilmeny med aktiv underline */}
          <nav className="flex flex-col gap-3 text-[0.9rem] uppercase tracking-[0.35em] text-ink/80">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) =>
                  [
                    "transition hover:text-ink",
                    isActive ? "text-ink underline decoration-ink/40 underline-offset-4" : "",
                  ].join(" ")
                }
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}


    </header >
  );
}

export default Header;
