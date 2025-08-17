import { NavLink } from "react-router-dom";

const tabs = [
    { to: "/",        label: "Home",    img: "/assets/menu/home.png",      alt: "Home" },
    { to: "/about",   label: "About",   img: "/assets/menu/about.png",     alt: "About" },
    { to: "/gallery", label: "Gallery", img: "/assets/menu/gallery.png",   alt: "Gallery" },
];

export default function MenuBar() {
    return (
        <nav className="flex items-center gap-3">
            {tabs.map(t => (
                <NavLink
                    key={t.to}
                    to={t.to}
                    className={({ isActive }) =>
                        [
                            "inline-flex items-center gap-2 rounded-xl border px-2 py-1 transition",
                            isActive ? "border-neutral-300 bg-neutral-800" : "border-neutral-800 hover:border-neutral-700"
                        ].join(" ")
                    }
                >
                    <img
                        src={t.img}
                        alt={t.alt}
                        className="h-8 w-8 object-contain rounded-lg"
                        draggable="false"
                    />
                    <span className="text-sm font-medium">{t.label}</span>
                </NavLink>
            ))}
        </nav>
    );
}