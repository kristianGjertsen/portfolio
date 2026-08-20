import type { ReactNode } from "react";
import { getButtonClasses, type ButtonVariant } from "./buttonStyles";

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
  download?: boolean | string;
  ariaLabel?: string;
  className?: string;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  children: ReactNode;
};

function Button({
  href,
  onClick,
  target,
  rel,
  download,
  ariaLabel,
  className,
  variant = "default",
  type = "button",
  children,
}: ButtonProps) {
  const classes = getButtonClasses({ variant, className });

  if (href) {
    return (
      <a
        className={classes}
        href={href}
        onClick={onClick}
        aria-label={ariaLabel}
        download={download}
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
