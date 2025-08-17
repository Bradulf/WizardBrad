// src/components/MenuBar.jsx
import { NavLink } from "react-router-dom";

export default function MenuBar() {
    const linkBase =
        "inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium transition";
    const idle = "border-neutral-800 hover:border-neutral-700";
    const active = "border-neutral-300 bg-neutral-800";

    return (
        <nav className="flex items-center gap-3">
            <NavLink to="/" className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}>Home</NavLink>
            <NavLink to="/about" className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}>About</NavLink>
            <NavLink to="/gallery" className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}>Gallery</NavLink>
        </nav>
    );
}