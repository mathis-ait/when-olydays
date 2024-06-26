import { Bodies, Common, Engine, World } from 'matter-js';
import { useEffect, useRef, useState } from 'react';
import { FallingAlbums } from './FallingAlbums';

const FINAL_DATE = new Date(2024, 9, 10);

function App() {
  const engineRef = useRef<Engine>();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dateDiff, setDateDiff] = useState(FINAL_DATE.getTime() - Date.now());
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateDiff(FINAL_DATE.getTime() - Date.now());

      const value = Common.random(0, 10);
      if (value < 5) return;

      handleAddAlbum();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleAddAlbum = () => {
    const sprites = Array.from({ length: 4 }, (_, i) => `/images/${(i + 1).toString()}.jpeg`);
    
    const randomIndex = Math.floor(Common.random(0, sprites.length));
    const texture = sprites[randomIndex] ?? '';

    const img = new Image();
    img.src = texture;

    img.onload = () => {
      if (!engineRef.current) return;
      const album = Bodies.rectangle(
        Common.random(0, window.innerWidth),
        0,
        img.width * 0.1,
        img.height * 0.1,
        {
          render: {
            sprite: {
              texture,
              xScale: 0.1,
              yScale: 0.1,
            },
          },
        }
      );

      World.add(engineRef.current.world, album);
    };
  };

  const handleButtonClick = () => {
    setClickCount((prev) => prev + 1);
    handleAddAlbum();
  };

  return (
    <>
      <FallingAlbums buttonRef={buttonRef} engineRef={engineRef} />
      <div className="h-full w-full flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl">
          C&apos;est quand les{' '}
          <u>
            <b>VACANCES</b>
          </u>{' '}
          ?
        </h1>
        <p>Dans {Math.floor(dateDiff / (1024 * 60 * 60 * 24))} jours</p>
        <p>{Math.floor(dateDiff / (1024 * 60 * 60))} heures</p>
        <p>{Math.floor(dateDiff / (1024 * 60))} minutes</p>
        <p>{Math.floor(dateDiff / 1024)} secondes</p>
        <button ref={buttonRef} onClick={handleButtonClick} className="py-3 px-4 mt-4 top-[60%] bg-slate-700 rounded absolute">
          VITE JPP ! 😢
        </button>
      </div>
      {clickCount > 10 && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <img src="/nono.jpg" className='w-80'/>
          <p className="text-3xl text-center">Sois patient mon reuf</p>
        </div>
      )}
    </>
  );
}

export default App;
