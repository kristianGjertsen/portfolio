import type { ReactNode } from "react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

type HoldButtonProps = {
    durationMs?: number;
    onComplete: () => void;
    children: ReactNode;
    className?: string;
};

function useHoldProgress(durationMs: number, onComplete: () => void) {
    const rafRef = useRef<number | null>(null);
    const startRef = useRef<number | null>(null);
    const [progress, setProgress] = useState(0);

    const stop = useCallback(() => {
        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        startRef.current = null;
        setProgress(0);
    }, []);

    const start = useCallback(() => {
        if (rafRef.current !== null) {
            return;
        }
        startRef.current = performance.now();

        const tick = () => {
            const elapsed = performance.now() - (startRef.current ?? 0);
            const nextProgress = Math.min(elapsed / durationMs, 1);
            setProgress(nextProgress);

            if (nextProgress >= 1) {
                stop();
                onComplete();
                return;
            }
            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
    }, [durationMs, onComplete, stop]);

    return { progress, start, stop };
}

export function HoldButton({
    durationMs = 1500,
    onComplete,
    children,
    className,
}: HoldButtonProps) {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const { progress, start, stop } = useHoldProgress(durationMs, onComplete);
    const [outline, setOutline] = useState({ width: 0, height: 0, radius: 0 });
    const [isHolding, setIsHolding] = useState(false);

    useEffect(() => {
        if (!isHolding) {
            return;
        }

        const handleEnd = () => {
            setIsHolding(false);
            stop();
        };

        window.addEventListener("pointerup", handleEnd);
        window.addEventListener("pointercancel", handleEnd);

        return () => {
            window.removeEventListener("pointerup", handleEnd);
            window.removeEventListener("pointercancel", handleEnd);
        };
    }, [isHolding, stop]);

    useLayoutEffect(() => {
        const element = buttonRef.current;
        if (!element) {
            return;
        }

        const measure = () => {
            const rect = element.getBoundingClientRect();
            const style = window.getComputedStyle(element);
            const radiusValue = style.borderRadius.split(" ")[0];
            const radius = Number.parseFloat(radiusValue) || 0;
            setOutline({ width: rect.width, height: rect.height, radius });
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        window.addEventListener("resize", measure);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, []);

    const strokeWidth = 2;
    const rectX = strokeWidth / 2;
    const rectY = strokeWidth / 2;
    const rectWidth = Math.max(outline.width - strokeWidth, 0);
    const rectHeight = Math.max(outline.height - strokeWidth, 0);
    const rectRadius = Math.max(outline.radius - strokeWidth / 2, 0);

    return (
        <button
            type="button"
            aria-label="Hold to confirm action"
            className={`relative touch-none select-none overflow-hidden rounded-xl bg-gray-900 p-1.5 text-white focus:outline-none${
                className ? ` ${className}` : ""
            }`}
            ref={buttonRef}
            onPointerDown={(event) => {
                event.preventDefault();
                if (isHolding) {
                    return;
                }
                event.currentTarget.setPointerCapture(event.pointerId);
                setIsHolding(true);
                stop();
                start();
            }}
            onPointerUp={(event) => {
                event.currentTarget.releasePointerCapture(event.pointerId);
                setIsHolding(false);
                stop();
            }}
            onPointerCancel={(event) => {
                event.currentTarget.releasePointerCapture(event.pointerId);
                setIsHolding(false);
                stop();
            }}
            onPointerLeave={(event) => {
                if (!isHolding) {
                    return;
                }
                event.currentTarget.releasePointerCapture(event.pointerId);
                setIsHolding(false);
                stop();
            }}
            onContextMenu={(event) => event.preventDefault()}
            onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") start();
            }}
            onKeyUp={(e) => {
                if (e.key === " " || e.key === "Enter") stop();
            }}
        >
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full"
                preserveAspectRatio="none"
                viewBox={`0 0 ${outline.width} ${outline.height}`}
            >
                <rect
                    className="transition-[stroke-dashoffset,opacity] duration-75"
                    fill="none"
                    pathLength="1"
                    rx={rectRadius}
                    ry={rectRadius}
                    stroke="rgb(239 68 68)"
                    strokeDasharray="1"
                    strokeDashoffset={1 - progress}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={strokeWidth}
                    style={{ opacity: progress === 0 ? 0 : 1 }}
                    x={rectX}
                    y={rectY}
                    width={rectWidth}
                    height={rectHeight}
                />
            </svg>

            <span className="relative">{children}</span>
        </button>
    );
}
