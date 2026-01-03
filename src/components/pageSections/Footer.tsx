function Footer() {
    return (
        <footer className="mt-auto border-t border-sand px-6 py-6 text-xs uppercase tracking-[0.3em] text-ink/60">
            <div className="mx-auto flex w-full lg:pl-10 lg:pr-10 flex-wrap items-center justify-between gap-4">
                <span>© 2026 Kristian Gjertsen</span>
                <span>Design · Frontend & Backend</span>
                <a
                    className="inline-flex items-center gap-2 transition hover:text-ink"
                    href="mailto:kristiangjertsen5@gmail.com"
                >
                    <svg
                        aria-hidden="true"
                        className="h-4 w-4 text-ink/60"
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
                    kristiangjertsen5@gmail.com
                </a>
                <a
                    className="inline-flex items-center gap-2 transition hover:text-ink"
                    href="tel:+4795410917"
                >
                    <svg
                        aria-hidden="true"
                        className="h-4 w-4 text-ink/60"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.8.3 1.6.5 2.3a2 2 0 0 1-.5 2.1L7.9 9.9a16 16 0 0 0 6.2 6.2l1.8-1.8a2 2 0 0 1 2.1-.5c.7.2 1.5.4 2.3.5a2 2 0 0 1 1.7 2z" />
                    </svg>
                    +47 954 10 917
                </a>
            </div>
        </footer>
    );
}

export default Footer;
