import { Link } from "react-router-dom";

type ButtonParam = {
    to: string;
    label: string;
    className?: string;
}

const standardClasses = "rounded-xl px-10 py-3 bg-ink text-paper inline-flex items-center";

function PageButton({ to, label, className }: ButtonParam) {
    return (
        // Tar inn parametre for destinasjon, label og sjekker om ClassName er sendt inn, lager en klasse for dette
        <Link to={to} className={standardClasses + (className ? ` ${className}` : '')}>
            {label}
        </Link>
    )
}

export default PageButton