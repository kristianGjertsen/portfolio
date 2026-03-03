import { Link } from "react-router-dom";
import { getButtonClasses, type ButtonVariant } from "./buttonStyles";

type PageButtonProps = {
  to: string;
  label: string;
  className?: string;
  variant?: ButtonVariant;
};

function PageButton({ to, label, className, variant = "default" }: PageButtonProps) {
  return (
    <Link
      to={to}
      className={getButtonClasses({
        variant,
        extraClasses: "px-10 py-3",
        className,
      })}
    >
      {label}
    </Link>
  );
}

export default PageButton;
