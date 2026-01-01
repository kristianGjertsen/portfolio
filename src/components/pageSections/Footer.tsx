function Footer() {
    return (
        <footer className="border-t border-sand px-6 py-6 text-xs uppercase tracking-[0.3em] text-ink/60">
            <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4">
                <span>© 2025 Kristian Gjertsen</span>
                <span>Design · Frontend</span>
                <a
                    className="transition hover:text-ink"
                    href="mailto:kristiangjertsen5@gmail.com"
                >
                    kristiangjertsen5@gmail.com
                </a>
            </div>
        </footer>
    );
}

export default Footer;
