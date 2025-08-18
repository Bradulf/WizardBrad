// components/FrameOverlay.jsx
export default function FrameOverlay({ theme }) {
    return (
        <div className="pointer-events-none absolute inset-0">
            {/* pick a theme */}
            {theme === "halloween" && <HalloweenFrame />}
            {theme === "storm" && <StormFrame />}
            {theme === "none" && null}
        </div>
    );
}

function HalloweenFrame() {
    // simple SVG corners + border-glow
    return (
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* outer stroke */}
            <rect x="1" y="1" width="98" height="98" rx="3" ry="3"
                  fill="none" stroke="#f97316" strokeOpacity="0.8" strokeWidth="1.5" />
            {/* inner glow */}
            <rect x="2" y="2" width="96" height="96" rx="2" ry="2"
                  fill="none" stroke="#fb923c" strokeOpacity="0.4" strokeWidth="0.6" />
            {/* spider-webby corners (super minimal) */}
            <path d="M2,28 10,20 2,12" stroke="#f59e0b" strokeWidth="0.5" fill="none" />
            <path d="M98,72 90,80 98,88" stroke="#f59e0b" strokeWidth="0.5" fill="none" />
            {/* pumpkins: use images if you have them */}
            {/* <image href="/assets/frames/pumpkin_left.png" x="2" y="80" width="10" height="10"/> */}
            {/* <image href="/assets/frames/pumpkin_right.png" x="88" y="80" width="10" height="10"/> */}
        </svg>
    );
}

function StormFrame() {
    return (
        <div className="w-full h-full">
            {/* dark cloud vignette using CSS radial gradients */}
            <div className="absolute inset-0 rounded-[6px]"
                 style={{ boxShadow: "inset 0 0 120px 40px rgba(0,0,0,0.6)" }} />
            {/* drizzle lines on top edge */}
            <div className="absolute top-0 left-0 right-0 h-8 opacity-30"
                 style={{ backgroundImage:
                         "repeating-linear-gradient(160deg, rgba(200,200,255,0.15) 0 1px, transparent 1px 6px)" }} />
            {/* border line */}
            <div className="absolute inset-0 rounded-[6px] border border-neutral-700/70" />
        </div>
    );
}