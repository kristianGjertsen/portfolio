import Header from "../../components/pageSections/Header";
import Footer from "../../components/pageSections/Footer";
import { useTranslation } from "react-i18next";
function Contact() {
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen bg-paper text-ink flex flex-col">
      <Header />

      <main className="mx-auto w-full max-w-5xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.35em] text-ink/60">
          {t("contactPage.tagline")}
        </p>
        <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl">
          {t("contactPage.title")}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-ink/70 sm:text-lg">
          {t("contactPage.description")}
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <a
            className="rounded-2xl border border-sand/80 bg-white/80 p-5 shadow-card transition hover:-translate-y-0.5"
            href="mailto:kristiangjertsen@gmail.com"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-ink/60">
              {t("contactPage.email_label")}
            </p>
            <div className="mt-3 flex items-center gap-2 text-lg text-ink">
              <svg
                aria-hidden="true"
                className="h-5 w-5 text-ink/60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6h16v12H4z" />
                <path d="m4 7 8 6 8-6" />
              </svg>
              <span>kristiangjertsen@gmail.com</span>
            </div>
          </a>
          <a
            className="rounded-2xl border border-sand/80 bg-white/80 p-5 shadow-card transition hover:-translate-y-0.5"
            href="tel:+47 954 10 917"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-ink/60">
              {t("contactPage.phone_label")}
            </p>
            <div className="mt-3 flex items-center gap-2 text-lg text-ink">
              <svg
                aria-hidden="true"
                className="h-5 w-5 text-ink/60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.8.3 1.6.5 2.3a2 2 0 0 1-.5 2.1L7.9 9.9a16 16 0 0 0 6.2 6.2l1.8-1.8a2 2 0 0 1 2.1-.5c.7.2 1.5.4 2.3.5a2 2 0 0 1 1.7 2z" />
              </svg>
              <span>+47 954 10 917</span>
            </div>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
export default Contact
