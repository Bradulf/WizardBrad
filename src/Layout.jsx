// Layout.jsx
import MenuBar from "./components/MenuBar.jsx";
import StreetScene from "./components/StreetScene.jsx";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100">
            <header className="sticky top-0 z-30 bg-neutral-950/60 backdrop-blur border-b border-neutral-800">
                <div className="mx-auto max-w-7xl px-4 py-3">
                    <MenuBar />
                </div>
            </header>

            {/* Full-width top hero */}
            <section className="w-full">
                <StreetScene /> {/* This is the hero banner */}
            </section>

            {/* Feed under hero */}
            <main className="mx-auto max-w-4xl px-4 py-8">
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900">
                    {children}
                </div>
            </main>
        </div>
    );
}