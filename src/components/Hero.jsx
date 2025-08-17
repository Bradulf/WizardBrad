// src/components/Hero.jsx
import StreetScene from "./StreetScene.jsx";

export default function Hero() {
    return (
        <section className="relative w-full">
            {/* Height of the hero — tweak 50/60/70vh to taste */}
            <div className="h-[60vh] w-full overflow-hidden bg-neutral-900">
                {/* Your animated street + wizard lives inside StreetScene */}
                <StreetScene variant="hero" />
            </div>

            {/* Optional bottom fade so content emerges nicely */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-neutral-950" />
        </section>
    );
}