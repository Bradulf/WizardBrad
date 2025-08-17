export default function ScenePanel({ src = "/assets/side/buildings.png", alt = "Scene" }) {
    return (
        <div className="h-full w-full">
            <img
                src={src}
                alt={alt}
                className="h-full w-full object-cover"
                draggable="false"
            />
        </div>
    );
}