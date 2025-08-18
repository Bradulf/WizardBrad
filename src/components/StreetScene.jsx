import { useEffect, useRef } from 'react';
import { Application, Container, Graphics, Assets, Texture, AnimatedSprite } from 'pixi.js';

export default function StreetScene() {
  const mountRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    let destroyed = false;

    (async () => {
      const app = new Application();
        const mount = mountRef.current;
        const getSize = () => ({
              w: mount?.clientWidth ?? window.innerWidth,
              h: mount?.clientHeight ?? Math.round(window.innerHeight * 0.5)
        });
        await app.init({
            background: '#0f0f17',
            antialias: true,
            autoDensity: true,         // match canvas pixels to CSS px * DPR
            resizeTo: mountRef.current // PIXI resizes to the container automatically
        });
        app.canvas.style.display = 'block';
        app.canvas.style.width = '100%';
        app.canvas.style.height = '100%';
      if (destroyed) return app.destroy(true);
      appRef.current = app;
      mountRef.current.appendChild(app.canvas);

        // Preload wizard frames (individual PNGs)
        const wizardFramePaths = [
            '/assets/wizard/walk_0.png',
            '/assets/wizard/walk_1.png',
            '/assets/wizard/walk_2.png',
            '/assets/wizard/walk_3.png',
            '/assets/wizard/walk_4.png',
            '/assets/wizard/walk_5.png',
        ];
        const wizardTextures = await Promise.all(
            wizardFramePaths.map(p => Assets.load(p))
        );

      // --- CONFIG ---
      const colWidth = 180;            // width of building columns on L/R
      const segH = 160;                // height of one vertical tile segment
      let sceneH = app.screen.height;
      let streetX = colWidth;
      let streetW = app.screen.width - colWidth * 2;
      let dashW = Math.max(6, streetW * 0.02);

      // --- LAYERS ---
      const farLayer = new Container();   // trees, slow
      const midLayer = new Container();   // buildings, dashes
      const nearLayer = new Container();  // trash/debris, fast
      app.stage.addChild(farLayer, midLayer, nearLayer);

      // Helper: make a tiled vertical column (for left/right buildings)
      function makeBuildingColumn(x) {
        const col = new Container();
        col.x = x;

        const tilesNeeded = Math.ceil(sceneH / segH) + 2; // fill + overscan
        for (let i = 0; i < tilesNeeded; i++) {
          const y = i * segH - segH; // start one segment above
          const g = new Graphics();
          // building block
          g.rect(0, 0, colWidth, segH - 8).fill(0x232334);
          g.y = y;

          // windows
          const cols = 4;
          const rows = 5;
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
        return col;
      }

      // Left & Right building columns
      const leftCol = makeBuildingColumn(0);
      const rightCol = makeBuildingColumn(app.screen.width - colWidth);
      midLayer.addChild(leftCol, rightCol);

      // Street background (static center strip)
      const streetBG = new Graphics();
      streetBG.rect(streetX, 0, streetW, sceneH).fill(0x3f3f46);
      app.stage.addChildAt(streetBG, 0); // behind everything

      // Lane dashes (repeat vertically)
      const dashContainer = new Container();
      midLayer.addChild(dashContainer);

      const dashH = 24;
      const gap = 32;
      const laneX = app.screen.width / 2 - dashW / 2;
      const dashCount = Math.ceil(sceneH / (dashH + gap)) + 2;
      for (let i = 0; i < dashCount; i++) {
        const d = new Graphics();
        d.rect(0, 0, dashW, dashH).fill(0xbdbdbd);
        d.x = laneX;
        d.y = i * (dashH + gap) - dashH;
        dashContainer.addChild(d);
      }

      // Far trees (parallax, slow)
      const treeContainer = new Container();
      farLayer.addChild(treeContainer);
      const treeCount = 6;
      for (let i = 0; i < treeCount; i++) {
        const t = new Graphics();
        // little round tree canopy
        t.circle(0, 0, 18).fill(0x1f7a4b);
        // randomize left or right sidewalk edge
        const leftSide = Math.random() > 0.5;
        t.x = leftSide ? colWidth - 20 : app.screen.width - colWidth + 20;
        t.y = Math.random() * sceneH;
        treeContainer.addChild(t);
      }

      // Near trash cans (parallax, fast)
      const trashContainer = new Container();
      nearLayer.addChild(trashContainer);
      const trashCount = 5;
      for (let i = 0; i < trashCount; i++) {
        const tr = new Graphics();
        tr.rect(0, 0, 18, 26).fill(0x8a8a8a);
        tr.x = (Math.random() * (streetW - 80)) + streetX + 40; // keep away from center
        tr.y = Math.random() * sceneH;
        trashContainer.addChild(tr);
      }

        // Wizard animated sprite (top-down walk)
        const wizard = new AnimatedSprite(wizardTextures);
        wizard.anchor.set(0.5);                 // center on feet-ish; tweak if needed
        wizard.animationSpeed = 0.15;           // 0.1–0.2 looks natural
        wizard.play();

        wizard.x = streetX + streetW / 2;        // centered horizontally
        wizard.y = sceneH * 0.55;               // a hair below center like before

        // Scale so it reads at your hero size; adjust to taste
        wizard.scale.set(1.0);                  // try 0.8–1.4 depending on your art

        nearLayer.addChild(wizard);

      // Scroll speeds (pixels per frame)
      const speedFar = 0.5;
      const speedMid = 1.2;   // buildings + dashes
      const speedNear = 2.0;  // trash

      // Move a vertical container down and wrap its children
      function scrollAndWrapY(container, speed, tileHeight) {
        for (const child of container.children) {
          child.y += speed;
          if (child.y >= sceneH) {
            child.y -= (Math.ceil(sceneH / tileHeight) + 2) * tileHeight;
          }
        }
      }

      // Ticker: move world DOWN to simulate the wizard walking up the street
      app.ticker.add(() => {
        // Buildings columns are composed of tile children → wrap by segH
        scrollAndWrapY(leftCol, speedMid, segH);
        scrollAndWrapY(rightCol, speedMid, segH);

        // Lane dashes wrap by dashH+gap
        for (const d of dashContainer.children) {
          d.y += speedMid;
          if (d.y >= sceneH) d.y -= (dashH + gap) * dashCount;
        }

        // Trees (far)
        for (const t of treeContainer.children) {
          t.y += speedFar;
          if (t.y >= sceneH) t.y -= sceneH + 60;
        }

        // Trash (near)
        for (const tr of trashContainer.children) {
          tr.y += speedNear;
          if (tr.y >= sceneH) tr.y -= sceneH + 60;
        }
      });

      // Handle resize (keep columns on edges; recalc street width)
      function onResize() {
        const w = app.screen.width;
        sceneH = app.screen.height;
        // recompute street geometry
        streetX = colWidth;
        streetW = w - colWidth * 2;
        dashW = Math.max(6, streetW * 0.02);
        rightCol.x = w - colWidth;
        streetBG.clear().rect(streetX, 0, streetW, sceneH).fill(0x3f3f46);
        const newLaneX = streetX + streetW / 2 - dashW / 2;

        for (const d of dashContainer.children) d.x = newLaneX;

        wizard.x = streetX + streetW / 2;
      }
      window.addEventListener('resize', onResize);

      // cleanup
      return () => {
        window.removeEventListener('resize', onResize);
      };
    })();

    return () => {
      destroyed = true;
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, []);

    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}