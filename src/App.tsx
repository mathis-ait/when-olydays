import { Bodies, Common, Engine, Render, Runner, World } from 'matter-js';
import { useEffect, useRef, useState } from 'react';

const FINAL_DATE = new Date(2024, 6, 6);

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine>();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dateDiff, setDateDiff] = useState(FINAL_DATE.getTime() - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateDiff(FINAL_DATE.getTime() - Date.now());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const world = engineRef.current?.world;
    if (!world) return;

    const interval = setInterval(() => {
      const value = Common.random(0, 10);
      if (value < 5) return;

      handleAddAlbum();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = Engine.create();
    engineRef.current = engine;

    const cw = window.innerWidth;
    const ch = window.innerHeight;

    const render = Render.create({
      engine,
      canvas: canvasRef.current,
      options: {
        width: cw,
        height: ch,
        background: 'transparent',
        wireframes: false,
      },
    });

    const bodies = [];

    const buttonPos = buttonRef.current?.getBoundingClientRect();
    if (buttonPos) {
      bodies.push(
        Bodies.rectangle(
          buttonPos.x + buttonPos.width / 2,
          buttonPos.y + buttonPos.height / 2,
          buttonPos.width,
          buttonPos.height,
          { isStatic: true, render: { visible: false } },
        ),
      );
    }

    bodies.push(
      Bodies.rectangle(cw / 2, ch - 3, cw, 5, {
        isStatic: true,
        render: { visible: false },
      }),
    );

    World.add(engine.world, bodies);

    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, engine);

    Render.lookAt(render, { min: { x: 0, y: 0 }, max: { x: cw, y: ch } });

    return () => {
      Runner.stop(runner);
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, []);

  const handleAddAlbum = () => {
    if (!engineRef.current) return;

    World.add(
      engineRef.current.world,
      Bodies.rectangle(Common.random(0, window.innerWidth), 0, 120, 120, {
        render: { sprite: { texture: '/16.jpg', xScale: 0.3, yScale: 0.3 } },
        angle: Common.random(0, 3),
      }),
    );
  };

  return (
    <>
      <canvas className="absolute left-0 top-0 z-0 pointer-events-none" ref={canvasRef} />
      <div className="h-full w-full flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl">
          When{' '}
          <u>
            <b>WEJDENE</b>
          </u>{' '}
          ?
        </h1>
        <p>Dans {Math.floor(dateDiff / (1024 * 60 * 60 * 24))} jours</p>
        <p>{Math.floor(dateDiff / (1024 * 60 * 60))} heures</p>
        <p>{Math.floor(dateDiff / (1024 * 60))} minutes</p>
        <p>{Math.floor(dateDiff / 1024)} secondes</p>
        <button ref={buttonRef} onClick={handleAddAlbum} className="py-3 px-4 mt-4 bg-slate-700 rounded">
          Donne 😢
        </button>
      </div>
    </>
  );
}

export default App;