import MenuBar from "./components/MenuBar.jsx";

export default function Layout({ left, right, children }) {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100">
            {/* Top menu with image links */}
            <header className="sticky top-0 z-20 bg-neutral-950/80 backdrop-blur border-b border-neutral-800">
                <div className="mx-auto max-w-7xl px-4 py-3">
                    <MenuBar />
                </div>
            </header>

            {/* 3-col frame */}
            <div className="mx-auto max-w-7xl grid grid-cols-12 gap-4 px-4 py-6">
                {/* Left art panel */}
                <aside className="hidden lg:block col-span-3">
                    <div className="sticky top-[4.5rem] h-[calc(100vh-5.5rem)] overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
                        {left}
                    </div>
                </aside>

                {/* Center feed */}
                <main className="col-span-12 lg:col-span-6">
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900">
                        {/* Make just the inner content scroll if you prefer fixed chrome */}
                        <div className="max-h-[calc(100vh-7.5rem)] overflow-y-auto overscroll-contain rounded-2xl">
                            {children}
                        </div>
                    </div>
                </main>

                {/* Right art panel */}
                <aside className="hidden lg:block col-span-3">
                    <div className="sticky top-[4.5rem] h-[calc(100vh-5.5rem)] overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
                        {right}
                    </div>
                </aside>
            </div>
        </div>
    );
}