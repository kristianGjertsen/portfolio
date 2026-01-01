import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import FrontPage from "../FrontPage/FrontPage";
import FrontPageError from "../FrontPage/FrontPageError";

type IntroPhase = "typing" | "submitted" | "loading" | "done";
type BackgroundView = "none" | "error" | "final";

const loadingSteps = [
    "Generating layout...",
    "Building sections...",
    "Applying styles...",
    "Finalizing details...",
];

type IntroAnimationProps = {
    version?: ReactNode;
};

const introStorageKey = "intro_seen";
const introShowDelayMs = 260;
const errorViewDurationMs = 1200;

const hasSeenIntroAlready = () => {
    if (typeof window === "undefined") {
        return false;
    }
    return window.localStorage.getItem(introStorageKey) === "1";
};

const promptTextFirst = "Make project page for Kristian Gjertsen";
const promptTextSecond = "what the f is this make it looke nice!!!";

function IntroanimationPage({ version }: IntroAnimationProps) {

    // Enkel state machine for introen.
    const initialSeenIntro = hasSeenIntroAlready();
    const [hasSeenIntro, setHasSeenIntro] = useState(initialSeenIntro);
    const [cycle, setCycle] = useState<0 | 1>(initialSeenIntro ? 1 : 0);
    const [phase, setPhase] = useState<IntroPhase>(
        initialSeenIntro ? "done" : "typing"
    );
    const [typedText, setTypedText] = useState("");
    const [loadingIndex, setLoadingIndex] = useState(0);
    const [showOverlay, setShowOverlay] = useState(!initialSeenIntro);
    const [backgroundView, setBackgroundView] = useState<BackgroundView>(
        initialSeenIntro ? "final" : "none"
    );
    const [reduceMotion, setReduceMotion] = useState(false);
    // Velg tekst basert på hvilken runde vi er i.
    const activePromptText = cycle === 0 ? promptTextFirst : promptTextSecond;

    // Skipp animasjonen hvis brukeren foretrekker redusert bevegelse.
    useEffect(() => {
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        const handleChange = () => setReduceMotion(media.matches);
        handleChange();
        if (media.addEventListener) {
            media.addEventListener("change", handleChange);
            return () => media.removeEventListener("change", handleChange);
        }
        media.addListener(handleChange);
        return () => media.removeListener(handleChange);
    }, []);

    // Ved redusert bevegelse: gå direkte til sluttresultatet.
    useEffect(() => {
        if (!reduceMotion || phase === "done") {
            return;
        }
        if (!hasSeenIntro) {
            window.localStorage.setItem(introStorageKey, "1");
            setHasSeenIntro(true);
        }
        setCycle(1);
        setPhase("done");
        setBackgroundView("final");
        setShowOverlay(false);
    }, [hasSeenIntro, phase, reduceMotion]);

    // Skriver ut prompten ett tegn av gangen.
    useEffect(() => {
        if (reduceMotion || phase !== "typing") {
            return;
        }
        if (typedText.length >= activePromptText.length) {
            return;
        }
        const timer = window.setTimeout(() => {
            setTypedText(activePromptText.slice(0, typedText.length + 1));
        }, 45);
        return () => window.clearTimeout(timer);
    }, [activePromptText, reduceMotion, phase, typedText]);

    // Går til "submitted" når skrivingen er ferdig.
    useEffect(() => {
        if (reduceMotion || phase !== "typing") {
            return;
        }
        if (typedText.length !== activePromptText.length) {
            return;
        }
        const timer = window.setTimeout(() => setPhase("submitted"), 300);
        return () => window.clearTimeout(timer);
    }, [activePromptText, reduceMotion, phase, typedText]);

    // Kort pause før "loading".
    useEffect(() => {
        if (reduceMotion || phase !== "submitted") {
            return;
        }
        const timer = window.setTimeout(() => setPhase("loading"), 350);
        return () => window.clearTimeout(timer);
    }, [reduceMotion, phase]);

    // Simulerer loading med tekst og progress-bar.
    useEffect(() => {
        if (reduceMotion || phase !== "loading") {
            return;
        }
        setLoadingIndex(0);
        const interval = window.setInterval(() => {
            setLoadingIndex((prev) =>
                Math.min(prev + 1, loadingSteps.length - 1)
            );
        }, 480);
        const timer = window.setTimeout(() => setPhase("done"), 1800);
        return () => {
            window.clearInterval(interval);
            window.clearTimeout(timer);
        };
    }, [reduceMotion, phase]);

    // Første runde: vis error-siden kort, så restart animasjonen.
    // Andre runde: vis riktig side og marker introen som sett.
    useEffect(() => {
        if (phase !== "done") {
            return;
        }
        if (cycle === 0) {
            const showErrorTimer = window.setTimeout(() => {
                setBackgroundView("error");
                setShowOverlay(false);
            }, introShowDelayMs);

            const restartTimer = window.setTimeout(() => {
                setTypedText("");
                setLoadingIndex(0);
                setPhase("typing");
                setCycle(1);
                setShowOverlay(true);
            }, introShowDelayMs + errorViewDurationMs);

            return () => {
                window.clearTimeout(showErrorTimer);
                window.clearTimeout(restartTimer);
            };
        }

        const showFinalTimer = window.setTimeout(() => {
            setBackgroundView("final");
            setShowOverlay(false);
        }, introShowDelayMs);

        if (!hasSeenIntro) {
            window.localStorage.setItem(introStorageKey, "1");
            setHasSeenIntro(true);
        }

        return () => window.clearTimeout(showFinalTimer);
    }, [cycle, hasSeenIntro, phase]);

    const progress =
        ((Math.min(loadingIndex + 1, loadingSteps.length) / loadingSteps.length) *
            100);

    const errorView = <FrontPageError />;
    const finalView = version ?? <FrontPage />;

    // Skip-knapp.
    const handleSkip = () => {
        if (!hasSeenIntro) {
            window.localStorage.setItem(introStorageKey, "1");
            setHasSeenIntro(true);
        }
        setCycle(1);
        setPhase("done");
        setBackgroundView("final");
        setShowOverlay(false);
    };

    return (
        <div className="relative min-h-screen bg-paper text-ink">
            <div className="relative z-0">
                <div className="transition-opacity duration-700">
                    {backgroundView === "error" ? errorView : null}
                    {backgroundView === "final" ? finalView : null}
                </div>
            </div>

            <div
                className={`absolute inset-0 z-10 transition-opacity duration-500 ${showOverlay ? "opacity-100" : "pointer-events-none opacity-0"}`}>

                <main className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
                    <div className="w-full max-w-xl rounded-3xl border border-ink/30 bg-ink p-6 text-paper shadow-card motion-safe:animate-throw-in-left">
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-paper/60">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-paper/30" />
                                <span className="h-2 w-2 rounded-full bg-paper/50" />
                                <span className="h-2 w-2 rounded-full bg-paper/70" />
                            </div>
                            <span> AI model 4.2 </span>
                        </div>

                        <div className="mt-6 rounded-2xl border border-paper/15 bg-black/70 p-4 text-left font-mono text-sm text-paper/80">
                            <div className="flex items-start gap-2">
                                <span className="text-paper/40">&gt;</span>
                                <span className="min-h-[1.25rem]">
                                    {typedText}
                                </span>
                                {phase === "typing" && (
                                    <span className="ml-1 inline-block h-4 w-[1px] bg-paper/70 animate-pulse" />
                                )}
                            </div>

                            {phase === "submitted" && (
                                <div className="mt-3 flex items-center gap-2 text-xs text-paper/60">
                                    <span className="rounded border border-paper/30 px-2 py-1 uppercase tracking-[0.2em]">
                                        Enter
                                    </span>
                                    <span>Submitting prompt...</span>
                                </div>
                            )}

                            {phase === "loading" && (
                                <div className="mt-4 space-y-2 text-xs text-paper/60">
                                    {loadingSteps.map((step, index) => (
                                        <div
                                            className={`transition-opacity duration-300 ${index <= loadingIndex
                                                ? "opacity-100"
                                                : "opacity-40"
                                                }`}
                                            key={step}
                                        >
                                            {step}
                                        </div>
                                    ))}
                                    <div className="mt-3 h-1 w-full rounded-full bg-paper/20">
                                        <div
                                            className="h-full rounded-full bg-paper transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {phase === "done" && (
                                <div className="mt-4 text-xs uppercase tracking-[0.3em] text-paper/50">
                                    Launching...
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        className="mt-6 text-xs uppercase tracking-[0.4em] text-ink/50 transition hover:text-ink"
                        onClick={handleSkip}
                        type="button">
                        Skip intro
                    </button>
                </main>
            </div>
        </div>
    );
}

export default IntroanimationPage;
