export default function NewsFeed() {
    // fake items just to test scrolling
    const items = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        title: `Post #${i + 1}`,
        body: "Replace me with your blog card. This is where alien conspiracies go, presumably."
    }));

    return (
        <div className="p-4 sm:p-6 space-y-4">
            {items.map(it => (
                <article key={it.id} className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                    <h2 className="text-lg font-semibold mb-2">{it.title}</h2>
                    <p className="text-neutral-300 text-sm">{it.body}</p>
                </article>
            ))}
        </div>
    );
}