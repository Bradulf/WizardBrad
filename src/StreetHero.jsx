// StreetHero.jsx (wrapper around your StreetScene)
import StreetScene from "./components/StreetScene.jsx";
import FrameOverlay from "./components/FrameOverlay.jsx";

export default function StreetHero({ theme = "none" }) {
    return (
        <section className="relative w-full h-[50vh] border-b border-neutral-800">
            {/* PIXI canvas fills the box */}
            <StreetScene />

            {/* The seasonal border sits above it; clicks pass through */}
            <FrameOverlay theme={theme} />
        </section>
    );
}