import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className="relative min-h-screen bg-paper text-ink">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -top-28 left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,var(--sun)_0%,transparent_70%)] opacity-60 blur-3xl motion-safe:animate-float-slow" />
      <div className="pointer-events-none absolute -bottom-28 right-1/2 h-[320px] w-[320px] translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,var(--sea)_0%,transparent_70%)] opacity-50 blur-3xl motion-safe:animate-float-slow" />

      <main className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-ink/60">
          Projects
        </p>
        <h1 className="mt-6 text-5xl leading-tight sm:text-6xl lg:text-7xl">
          Kristian Gjertsen
        </h1>
        <p className="mt-4 max-w-xl text-lg text-ink/70">
          Designer og frontend-utvikler som lager rolige, skarpe digitale
          opplevelser for moderne merkevarer.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            className="rounded-full bg-ink px-8 py-3 text-sm font-medium text-paper shadow-soft transition hover:-translate-y-0.5"
            to="/kontakt"
          >
            Kontakt
          </Link>
          <Link
            className="rounded-full border border-ink/20 px-8 py-3 text-sm font-medium text-ink transition hover:border-ink/40"
            to="/projects"
          >
            Projects
          </Link>
        </div>
      </main>
    </div>
  )
}

export default HomePage
