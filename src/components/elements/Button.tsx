import type { ReactNode } from "react";

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  children: ReactNode;
};

const standardClasses =
  "inline-flex items-center gap-2 rounded-xl bg-ink/90 px-5 py-4 text-xs font-semibold tracking-[0.12em] text-paper shadow-soft transition hover:bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40";

function Button({
  href,
  onClick,
  target,
  rel,
  ariaLabel,
  className,
  type = "button",
  children,
}: ButtonProps) {
  const classes = className ? `${standardClasses} ${className}` : standardClasses;

  if (href) {
    return (
      <a
        className={classes}
        href={href}
        onClick={onClick}
        aria-label={ariaLabel}
        rel={rel}
        target={target}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

export default Button;
