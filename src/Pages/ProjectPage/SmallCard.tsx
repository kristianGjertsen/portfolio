import noImg from "../../assets/ProjectImages/noimg.avif";

const projectImages = import.meta.glob("../../assets/ProjectImages/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const getProjectImageSrc = (img?: string) => {
  if (!img) return noImg;
  return projectImages[`../../assets/ProjectImages/${img}`] ?? noImg;
};

type SmallCardProps = {
  title: string;
  year: number;
  img?: string;
  imgAlt?: string;
  short: string;
  onClick?: () => void;
};

function SmallCard({ title, year, img, imgAlt, short, onClick }: SmallCardProps) {
  const src = getProjectImageSrc(img);

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col rounded-xl border border-sand/70 bg-white/90 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md text-left"
    >
      <div
        className="relative w-full overflow-hidden bg-paper rounded-t-xl"
        style={{ aspectRatio: "4 / 3" }}
      >
        <img
          src={src}
          alt={imgAlt || title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="px-3 py-2 sm:px-4 sm:py-3 space-y-1">
        <span className="text-[0.68rem] uppercase tracking-[0.28em] text-ink/50">
          {year}
        </span>
        <h3 className="font-display text-base text-ink line-clamp-2 sm:text-lg">
          {title}
        </h3>
        <p className="text-xs text-ink/70 line-clamp-2 sm:text-sm">
          {short}
        </p>
      </div>
    </button>
  );
}

export default SmallCard;
