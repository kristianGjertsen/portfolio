import noImg from "../../assets/ProjectImages/noimg.avif";

const projectImages = import.meta.glob("../../assets/ProjectImages/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const getProjectImageSrc = (img?: string) => {
  if (!img) return noImg;
  return projectImages[`../../assets/ProjectImages/${img}`] ?? noImg;
};

type FullCardProps = {
  title: string;
  description: string;
  year: number;
  languages: string;
  img?: string;
  imgAlt?: string;
  showImage?: boolean;
};

function FullCard({
  title,
  description,
  year,
  languages,
  img,
  imgAlt,
  showImage = true,
}: FullCardProps) {
  const src = getProjectImageSrc(img);

  return (
    <article className="rounded-3xl border border-sand/80 bg-white/95 shadow-card backdrop-blur">
      {showImage && (
        <div className="h-72 w-full overflow-hidden rounded-t-3xl bg-paper sm:h-80">
          <img
            src={src}
            alt={imgAlt || title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="space-y-3 px-6 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-ink/60">
          <span>{year}</span>
          <span className="text-ink/50">{languages}</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl">{title}</h2>
        <p className="text-sm text-ink/70 sm:text-base">{description}</p>
      </div>
    </article>
  );
}

export default FullCard;
