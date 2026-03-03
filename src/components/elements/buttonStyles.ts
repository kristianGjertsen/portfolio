export type ButtonVariant = "default" |  "silver" | "white" | "lightBlue";

const baseButtonClasses =
  "rounded-lg pl-5 min-h-10 min-w-[120px] text-center px-4 py-2";

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-ink/90 text-paper shadow-soft hover:bg-ink",
  silver: "border border-zinc-300/70 bg-gradient-to-b from-zinc-100 via-zinc-300 to-zinc-500 text-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_0_rgba(82,82,82,0.45),0_18px_50px_-30px_rgba(10,11,13,0.55)]",
  white: "border-white border-2 bg-white/90 text-black shadow-xl hover:border-gray-300",
  lightBlue: "border-white border-2 bg-sky-200 text-black shadow-soft hover:bg-sky-300",
};

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type GetButtonClassesOptions = {
  variant?: ButtonVariant;
  extraClasses?: string;
  className?: string;
};

export function getButtonClasses({
  variant = "default",
  extraClasses,
  className,
}: GetButtonClassesOptions = {}) {
  return joinClasses(
    baseButtonClasses,
    variantClasses[variant],
    extraClasses,
    className,
  );
}
