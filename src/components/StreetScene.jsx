import { useEffect, useRef } from "react";
import {
    Application, Container, Graphics, Assets, AnimatedSprite
} from "pixi.js";

export default function StreetScene() {
    const mountRef = useRef(null);

    useEffect(() => {
        let destroyed = false;

        (async () => {
            const app = new Application();
            await app.init({
                background: "#0f0f17",
                antialias: true,
                autoDensity: true,
                resizeTo: mountRef.current,      // PIXI tracks the wrapper div
            });
            if (destroyed) { app.destroy(true); return; }
            mountRef.current.appendChild(app.canvas);
            app.canvas.style.display = "block";
            app.canvas.style.width = "100%";
            app.canvas.style.height = "100%";

            // ----------------------- GEOMETRY & CONSTANTS -----------------------
            const colWidth = 180;
            const segH = 160;

            let sceneH = app.screen.height;
            let streetX = colWidth;
            let streetW = app.screen.width - colWidth * 2;
            let dashW = Math.max(6, streetW * 0.02);

            // ----------------------------- LAYERS -------------------------------
            const farLayer  = new Container();
            const midLayer  = new Container();
            const nearLayer = new Container();
            app.stage.addChild(farLayer, midLayer, nearLayer);

            // ---------------------------- STREET BG -----------------------------
            const streetBG = new Graphics();
            streetBG.rect(streetX, 0, streetW, sceneH).fill(0x3f3f46);
            app.stage.addChildAt(streetBG, 0);

            // ------------------------- BUILDING COLUMNS -------------------------
            const leftCol  = new Container();   leftCol.x  = 0;
            const rightCol = new Container();   rightCol.x = app.screen.width - colWidth;
            midLayer.addChild(leftCol, rightCol);

            const buildColumnTiles = (col) => {
                const tilesNeeded = Math.ceil(sceneH / segH) + 2;
                for (let i = 0; i < tilesNeeded; i++) {
                    const y = i * segH - segH;
                    const g = new Graphics();
                    g.rect(0, 0, colWidth, segH - 8).fill(0x232334);
                    g.y = y;

                    const cols = 4, rows = 5;
                    for (let r = 0; r < rows; r++) {
                        for (let c = 0; c < cols; c++) {
                            const win = new Graphics();
                            const lit = Math.random() > 0.4;
                            win.rect(0, 0, 18, 14).fill(lit ? 0xffd86b : 0x2b2b2b);
                            win.x = 16 + c * 40;
                            win.y = 12 + r * 26 + (Math.random() * 4 - 2);
                            g.addChild(win);
                        }
                    }
                    col.addChild(g);
                }
            };
            buildColumnTiles(leftCol);
            buildColumnTiles(rightCol);

            // --------------------------- LANE DASHES ----------------------------
            const dashContainer = new Container();
            midLayer.addChild(dashContainer);
            const dashH = 24, gap = 32;

            // >>>>>>>>>>>>>>>>>>>> HELPER #1: rebuildDashes <<<<<<<<<<<<<<<<<<<<<<
            function rebuildDashes() {
                const needed = Math.ceil(sceneH / (dashH + gap)) + 2;
                dashContainer.removeChildren();

                const laneX = streetX + streetW / 2 - dashW / 2;
                for (let i = 0; i < needed; i++) {
                    const d = new Graphics();
                    d.rect(0, 0, dashW, dashH).fill(0xbdbdbd);
                    d.x = laneX;
                    d.y = i * (dashH + gap) - dashH;
                    dashContainer.addChild(d);
                }
            }
            rebuildDashes();

            // ------------------------------ TREES -------------------------------
            const treeContainer = new Container();
            farLayer.addChild(treeContainer);
            for (let i = 0; i < 6; i++) {
                const t = new Graphics();
                t.circle(0, 0, 18).fill(0x1f7a4b);
                const leftSide = Math.random() > 0.5;
                t.x = leftSide ? colWidth - 20 : app.screen.width - colWidth + 20;
                t.y = Math.random() * sceneH;
                treeContainer.addChild(t);
            }

            // ------------------------------ TRASH -------------------------------
            const trashContainer = new Container();
            nearLayer.addChild(trashContainer);
            for (let i = 0; i < 5; i++) {
                const tr = new Graphics();
                tr.rect(0, 0, 18, 26).fill(0x8a8a8a);
                tr.x = (Math.random() * (streetW - 80)) + streetX + 40;
                tr.y = Math.random() * sceneH;
                trashContainer.addChild(tr);
            }

            // ------------------------- WIZARD SPRITE ----------------------------
            const framePaths = [
                "/assets/wizard/walk_0.png",
                "/assets/wizard/walk_1.png",
                "/assets/wizard/walk_2.png",
                "/assets/wizard/walk_3.png",
                "/assets/wizard/walk_4.png",
                "/assets/wizard/walk_5.png",
            ];
            const wizardTextures = await Promise.all(framePaths.map(p => Assets.load(p)));
            const wizard = new AnimatedSprite(wizardTextures);
            wizard.anchor.set(0.5);
            wizard.animationSpeed = 0.15;
            wizard.play();
            wizard.x = streetX + streetW / 2;
            wizard.y = sceneH * 0.55;
            wizard.scale.set(1.0);
            nearLayer.addChild(wizard);

            // >>>>>>>>>>>>>>>>>>>> HELPER #2: rebuildColumns <<<<<<<<<<<<<<<<<<<<<
            function rebuildColumns() {
                const tilesNeeded = Math.ceil(sceneH / segH) + 2;

                const rebuild = (col, x) => {
                    col.removeChildren();
                    col.x = x;
                    for (let i = 0; i < tilesNeeded; i++) {
                        const y = i * segH - segH;
                        const g = new Graphics();
                        g.rect(0, 0, colWidth, segH - 8).fill(0x232334);
                        g.y = y;

                        const cols = 4, rows = 5;
                        for (let r = 0; r < rows; r++) {
                            for (let c = 0; c < cols; c++) {
                                const win = new Graphics();
                                const lit = Math.random() > 0.4;
                                win.rect(0, 0, 18, 14).fill(lit ? 0xffd86b : 0x2b2b2b);
                                win.x = 16 + c * 40;
                                win.y = 12 + r * 26 + (Math.random() * 4 - 2);
                                g.addChild(win);
                            }
                        }
                        col.addChild(g);
                    }
                };

                rebuild(leftCol, 0);
                rebuild(rightCol, app.screen.width - colWidth);
            }

            // ------------------------------ TICKER ------------------------------
            const speedFar = 0.5, speedMid = 1.2, speedNear = 2.0;
            const scrollAndWrapY = (container, speed, tileHeight) => {
                for (const child of container.children) {
                    child.y += speed;
                    if (child.y >= sceneH) {
                        child.y -= (Math.ceil(sceneH / tileHeight) + 2) * tileHeight;
                    }
                }
            };
            app.ticker.add(() => {
                scrollAndWrapY(leftCol, speedMid, segH);
                scrollAndWrapY(rightCol, speedMid, segH);

                for (const d of dashContainer.children) {
                    d.y += speedMid;
                    const stride = (dashH + gap) * (Math.ceil(sceneH / (dashH + gap)) + 2);
                    if (d.y >= sceneH) d.y -= stride;
                }
                for (const t of treeContainer.children) {
                    t.y += speedFar;
                    if (t.y >= sceneH) t.y -= sceneH + 60;
                }
                for (const tr of trashContainer.children) {
                    tr.y += speedNear;
                    if (tr.y >= sceneH) tr.y -= sceneH + 60;
                }
            });

            // ------------------------------ RESIZE ------------------------------
            function onResize() {
                // PIXI already resized to the container (resizeTo)
                const w = app.screen.width;
                sceneH = app.screen.height;

                streetX = colWidth;
                streetW = w - colWidth * 2;
                dashW = Math.max(6, streetW * 0.02);

                // redraw road
                streetBG.clear().rect(streetX, 0, streetW, sceneH).fill(0x3f3f46);

                // regenerate dashes at correct count/width, re-center lane
                rebuildDashes();

                // recenter wizard
                wizard.x = streetX + streetW / 2;

                // snap trees back to edges for new width
                for (const t of treeContainer.children) {
                    const onLeft = t.x < w / 2;
                    t.x = onLeft ? colWidth - 20 : w - colWidth + 20;
                    if (t.y > sceneH) t.y = Math.random() * sceneH;
                }
                // keep trash inside street
                for (const tr of trashContainer.children) {
                    tr.x = (Math.random() * (streetW - 80)) + streetX + 40;
                    if (tr.y > sceneH) tr.y = Math.random() * sceneH;
                }

                // re-tile building stacks so no gaps on tall windows
                rebuildColumns();
            }
            window.addEventListener("resize", onResize);
        })();

        return () => {
            destroyed = true;
        };
    }, []);

    // The parent section sets the height (e.g., h-[50vh]); we fill it.
    return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}