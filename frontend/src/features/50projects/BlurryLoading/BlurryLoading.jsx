import { useEffect, useState } from "react";
import "./BlurryLoading.css";

export default function BlurryLoading() {
  const [load, setLoad] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoad((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const scale = (num, in_min, in_max, out_min, out_max) => {
    return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  };

  return (
    <div className="bl-container">
      <section
        className="bl-bg"
        style={{ filter: `blur(${scale(load, 0, 100, 30, 0)}px)` }}
      ></section>
      <div
        className="bl-loading-text"
        style={{ opacity: scale(load, 0, 100, 1, 0) }}
      >
        {load}%
      </div>
    </div>
  );
}
