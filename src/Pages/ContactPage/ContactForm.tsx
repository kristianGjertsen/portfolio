import { type FormEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

function ContactForm() {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<{
    type: "idle" | "sending" | "success" | "error";
    message: string;
  }>({
    type: "idle",
    message: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ type: "sending", message: t("contactForm.sending") });

    if (!formRef.current) return;

    const emailjs = await import("@emailjs/browser");

    try {
      await emailjs.sendForm(
        "Portfolio_mail_id",
        "template_jkcmuam",
        formRef.current,
        "R_hhbCJFqB9BTp7kT"
      );
      await emailjs.sendForm(
        "Portfolio_mail_id",
        "template_gk9f06g",
        formRef.current,
        "R_hhbCJFqB9BTp7kT"
      );

      setStatus({
        type: "success",
        message: t("contactForm.success"),
      });
      formRef.current.reset();
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: t("contactForm.error") });
    }
  };

  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold leading-tight text-ink">
        {t("contactForm.heading")}
      </h2>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mt-3 grid gap-3 rounded-xl border border-sand/80 bg-white/90 p-4 shadow-card"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-ink">
            <span className="text-xs uppercase tracking-[0.3em] text-ink/60">
              {t("contactForm.name_label")}
            </span>
            <input
              className="rounded-xl border border-sand/70 bg-white px-3 py-2.5 text-base shadow-inner transition focus:border-ink focus:outline-none"
              name="name"
              placeholder={t("contactForm.name_placeholder")}
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-ink">
            <span className="text-xs uppercase tracking-[0.3em] text-ink/60">
              {t("contactForm.email_label")}
            </span>
            <input
              className="rounded-xl border border-sand/70 bg-white px-3 py-2.5 text-base shadow-inner transition focus:border-ink focus:outline-none"
              name="email"
              type="email"
              placeholder={t("contactForm.email_placeholder")}
              required
            />
          </label>
        </div>
        <label className="flex flex-col gap-2 text-sm text-ink">
          <span className="text-xs uppercase tracking-[0.3em] text-ink/60">
            {t("contactForm.message_label")}
          </span>
          <textarea
            className="min-h-[140px] rounded-xl border border-sand/70 bg-white px-3 py-2.5 text-base shadow-inner transition focus:border-ink focus:outline-none"
            name="message"
            placeholder={t("contactForm.message_placeholder")}
            required
          />
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <button
            type="submit"
            disabled={status.type === "sending"}
            className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.3em] text-paper transition hover:-translate-y-0.5 hover:bg-ink/90 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status.type === "sending"
              ? t("contactForm.sending")
              : t("contactForm.submit")}
          </button>
          {status.type !== "idle" && (
            <p
              className={`text-base ${
                status.type === "success"
                  ? "text-green-600"
                  : status.type === "error"
                  ? "text-red-600"
                  : "text-ink/60"
              }`}
              aria-live="polite"
            >
              {status.message}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}

export default ContactForm;
