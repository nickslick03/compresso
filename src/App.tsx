import { useState, useRef, useEffect, useMemo } from "react";

const photos = {
  messiah_locations: [
    {
      name: 'Boyer',
      url: 'https://raw.githubusercontent.com/nickslick03/compresso/refs/heads/main/photos/boyer.jpg'
    },
    {
      name: 'Witmer',
      url: 'https://www.derckandedson.com/wp-content/uploads/Messiah-University-Witmer-Photo-1.jpg'
    },
    {
      name: 'Frey',
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWJisvYAR7TmZ51phVe_pLb1fguEyRRWBmxw&s'
    },
    {
      name: 'Old Main',
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzyQufljtsJTyTrgF8OMZL2aWt5cRtWCzUzg&s'
    }
  ],

  state_maps: [
    {
      name: 'New Jersey',
      url: 'https://cdn4.picryl.com/photo/2019/09/27/combined-atlas-of-the-state-of-new-jersey-and-the-late-township-of-greenville-c74395-1024.jpg'
    },
    {
      name: 'Virginia',
      url: 'https://cdn4.picryl.com/photo/2019/09/13/map-of-virginia-40b748-1024.jpg'
    },
    {
      name: 'Florida',
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAIvEN_E-vD7sE-PFopzzuYdiqUfrjaWJ6TA&s'
    },
    {
      name: 'Pennsylvania',
      url: 'https://cdn18.picryl.com/photo/1955/01/01/pennsylvanias-state-and-national-forests-project-3-e52679-1024.jpg'
    }
  ],

  famous_people: [
    {
      name: 'Rihanna',
      url: 'https://live.staticflickr.com/3028/2976817877_b1615992e2.jpg'
    },
    {
      name: 'George Washington',
      url: 'https://upload.wikimedia.org/wikipedia/commons/d/da/George_Washington_MET_DT220048.jpg'
    },
    {
      name: "Jerry Seinfeld",
      url: 'https://www.pbs.org/wnet/pioneers-of-television/files/2014/04/9088097831_d31af2d6e5_o.jpg'
    },
    {
      name: 'Professor Lehman',
      url: 'https://raw.githubusercontent.com/nickslick03/compresso/refs/heads/main/photos/cindy-lehman.jpg'
    }
  ]
}

export default function App({
}: {
  defaultScale?: number;
  url?: string;
}) {

  const [category, setCategory] = useState<keyof typeof photos>(Object.keys(photos)[0] as keyof typeof photos);
  const [index, setIndex] = useState(0);

  const name = useMemo(() => photos[category][index].name, [category, index]);
  const url = useMemo(() => photos[category][index].url, [category, index]);

  const [quality, setQuality] = useState(1);
  const [scale, setScale] = useState(.03);

  const [compressed, setCompressed] = useState("");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [guess, setGuess] = useState('');

  const handleSubmit = () => {
    setError("");
    setCompressed("");

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {

      const canvas = canvasRef.current;
      if (canvas !== null) {

        canvas.width = img.naturalWidth * scale;
        canvas.height = img.naturalHeight * scale;

        const ctx = canvas.getContext("2d");

        ctx!.imageSmoothingEnabled = true;
        ctx!.imageSmoothingQuality = "high";

        ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressed = canvas.toDataURL("image/jpeg", quality / 100);
        setCompressed(compressed);
      }
    };

    img.onerror = () => setError("Failed to load image. Check the URL or CORS policy.");
    img.src = url;
  };

  function resetCompression() {
    setQuality(1);
    setScale(.03);
    setGuess("");
    (document.getElementById('guess') as HTMLInputElement).value = '';
  }

  useEffect(handleSubmit, [url, scale, quality]);

  useEffect(() => {
    if (guess == name) {
      setScale(1);
      setQuality(100);
    }
  }, [guess]);

  return (
    <div className="font-[Nunito] flex flex-col gap-4 justify-around min-h-screen">

      <h1 className="font-bold text-5xl p-4 pt-8 text-center">Compresso</h1>

      <div className="flex gap-2 justify-center">
        <label htmlFor="category">Category:</label>
        <select
          name="category"
          id="category"
          className="rounded-sm border focus:outline px-1"
          onInput={(e) => {
            setIndex(0);
            resetCompression();
            setCategory((e.target as HTMLInputElement).value.replaceAll(' ', '_') as keyof typeof photos);
          }}
        >
          {Object.keys(photos).map(category =>
            <option>
              {category.replaceAll('_', ' ')}
            </option>
          )}
        </select>
      </div>

      <div className="flex-1 self-center">
        <div className="self-center px-10 pt-5 pb-10 rounded-lg bg-gray-200 flex flex-col items-center gap-4">

          {error && <p className="text-red-500">{error}</p>}
          <canvas ref={canvasRef} style={{ display: "none" }} />

          <div
            className="flex gap-5 items-center"
          >
            <button
              className="font-bold text-2xl cursor-pointer select-none"
              onClick={() => {
                resetCompression();
                setIndex((index == 0 ? photos[category].length : index) - 1);
              }}
            >
              {'<'}
            </button>
            <div>
              {index + 1} / {photos[category].length}
            </div>
            <button
              className="font-bold text-2xl cursor-pointer select-none"
              onClick={() => {
                resetCompression();
                setIndex((index + 1 == photos[category].length ? -1 : index) + 1);
              }}
            >
              {'>'}
            </button>
          </div>

          <div>
            <img src={compressed} alt="Compressed" className="w-100 rounded-md border-2" />
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <label htmlFor="compression">Compression quality: </label>
              <input id="compression" className="rounded-sm border focus:outline px-1 text-right" type="number" min={1} max={100} value={quality} onChange={e => setQuality(+e.target.value)} />
              &nbsp;%
            </div>
            <div>
              <label htmlFor="scale">Scale: </label>
              <input id="scale" className="rounded-sm border focus:outline px-1 text-right" type="number" min={.01} max={1} step={.01} value={scale} onChange={e => setScale(Math.max(+e.target.value, .01))} />
            </div>
          </div>

          <form className="flex gap-2" onSubmit={(e) => {
            e.preventDefault();
            setGuess((document.getElementById('guess') as HTMLInputElement).value ?? '');
          }}>
            <input id="guess" className={`rounded-sm border focus:outline px-1 ${name === guess ? 'bg-green-200' : guess === '' ? '' : 'bg-red-200'}`} placeholder="take a guess..." />
            <button
              className="rounded-sm border focus:outline px-1"
            >
              Enter
            </button>
          </form>

          <div className={`${name === guess ? 'text-green-600' : guess === '' ? 'invisible' : 'text-red-600'}`}>
            {name === guess ? 'You got it!' : guess === '' ? 'hi' : 'Not quite...'}
          </div>

        </div>
      </div>

      <footer className="text-center">
        Made by <a href='https://github.com/nickslick03/compresso' className="text-indigo-700">Nicholas Epps</a>
      </footer>
    </div>
  );
}