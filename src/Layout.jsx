// Layout.jsx
// Layout.jsx
import MenuBar from "./components/MenuBar.jsx";
import StreetHero from "./StreetHero.jsx";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100">
            <header className="sticky top-0 z-30 bg-neutral-950/60 backdrop-blur border-b border-neutral-800">
                <div className="mx-auto max-w-7xl px-4 py-3"><MenuBar /></div>
            </header>

            <StreetHero theme="storm" />  {/* swap to "storm" or "none" */}

            <main className="mx-auto max-w-3xl px-4 pt-10 pb-16">
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900">{children}</div>
            </main>
        </div>
    );
}