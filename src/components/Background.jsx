import * as React from "react";

import "../css/background.css";

import test_logo from "../image/test/Spotify_Logo_RGB_Green.png";
import test_icon from "../image/test/Spotify_Icon_RGB_Green.png";

const interval = 60 * 1000

export default function Background(props) {
  const state = props.state;
  const audioArray = props.audioArray;
  const color = props.color;
  const saved = props.saved;
  const test = props.test;

  const image = state?.item?.album?.images?.[0]?.url;

  const [defsrc, setDefsrc] = React.useState();

  const setDef = () => {
    setDefsrc(saved?.items?.[Math.floor(Math.random() * saved?.items?.length)]?.track?.album?.images?.[0]?.url);
  };

  React.useEffect(() => {
    if (!saved) return;
    setDef();
    const intervalId = setInterval(() => {
      setDef();
    }, interval);
    return () => {
      clearInterval(intervalId);
    };
  }, saved);

  React.useEffect(() => {
    const canvas = document.getElementById("canvas");
    if (!canvas) return;
    const vmax = Math.max(document.documentElement.clientWidth, document.documentElement.clientHeight);
    const vmin = Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight);
    canvas.width = vmax;
    canvas.height = vmax;
    const context = canvas.getContext("2d");
    const rin = vmin / 4;
    const fan = 2 * Math.PI / audioArray.length;
    const min = Math.min(...audioArray);
    const max = Math.max(...audioArray);  
    const threshold = (max - min) * (2/3);
    const getXY = (a, i) => {
      const v = rin + ((a > threshold ? (a - threshold) : 0) * (vmin/2) * 2);
      const x = (v * Math.cos(i * fan)) + (vmax / 2);
      const y = (v * Math.sin(i * fan)) + (vmax / 2);
      return [x, y];
    };
    audioArray.push(audioArray[0]);
    audioArray.forEach((a, i) => {
      const [x, y] = getXY(a, i)
      if (i === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });
    context.lineWidth = vmin / 200;
    context.strokeStyle = color ?? "#fff";
    context.stroke();
  }, [audioArray]);

  React.useEffect(() => {
    const canvas = document.getElementById("canvas");
    if (!canvas) return;
    canvas.className = "";
    window.requestAnimationFrame((time) => {
      window.requestAnimationFrame((time) => {
        canvas.className = "canvas";
      });
    });
  }, [state?.item?.id]);
  

  return (
    <div className="background">
      <img className={image ? "jacket" : "jacket disable"} src={test ? test_logo : image ?? defsrc} />
      {(image || test) && <canvas id="canvas" className={state?.is_playing ? "canvas" : "canvas paused"} ></canvas>}
      {(image || test) && <img key={image} className={state?.is_playing ? "disk" : "disk paused"} src={test ? test_icon : image} />}
    </div>
  );
}