import type { FunctionComponent } from "react";

import { useState, useEffect, useRef } from "react";
import useViewSize from "./useViewSize";

import Vibrant from "node-vibrant";

import styles from "@/styles/app/spotify/wallpaper/background.module.css";

import spotify_logo from "../image/Spotify_Logo_RGB_Green.png";

const interval = 60 * 1000;

type Props = {
  margin: number[];
  playbackState: SpotifyApi.CurrentPlaybackResponse | undefined;
  mySavedTracks?: SpotifyApi.UsersSavedTracksResponse;
  audioArray: number[];
};
const Component: FunctionComponent<Props> = (props) => {
  const margin = props.margin;
  const playbackState = props.playbackState;
  const mySavedTracks = props.mySavedTracks;
  const audioArray = props.audioArray;

  const image = playbackState?.item?.album.images.at(0)?.url;
  const playing = playbackState?.is_playing;

  const [color, setColor] = useState<string>();
  const [prevImage, setPrevImage] = useState<string>();
  const [keepImage, setKeepImage] = useState<string>();

  const getColor = (path: string | undefined) => {
    if (!path) return;
    const vibrant = Vibrant.from(path);
    vibrant.getPalette((_, palette) => setColor(palette?.Muted?.hex));
  };
  if (image !== prevImage) {
    getColor(image);
    setPrevImage(image);
  }

  const canvas = useRef<HTMLCanvasElement>(null);
  const [width, height] = useViewSize();

  const minDir = Number(width < height);
  const diff =
    margin.filter((_, i) => i % 2 === minDir).reduce((acc, m) => acc + m, 0) /
    2;
  useEffect(() => {
    if (!canvas.current) return;
    canvas.current.width = width;
    canvas.current.height = height;
    const rin = (Math.min(width, height) / 2 - diff) / 2;
    const fan = (2 * Math.PI) / audioArray.length;
    const top = margin.at(0) ?? 0;
    const right = margin.at(1) ?? 0;
    const bottom = margin.at(2) ?? 0;
    const left = margin.at(3) ?? 0;
    const max = Math.max(...audioArray);
    const threshold = max * (2 / 3);
    const getXY = (value: number, index: number): [number, number] => {
      const v = rin + (value > threshold ? value : 0) * rin;
      const x = (width - (left + right)) / 2 + left + Math.cos(index * fan) * v;
      const y = (height - (top + bottom)) / 2 + top + Math.sin(index * fan) * v;
      return [x, y];
    };
    const context = canvas.current.getContext("2d");
    if (!context) return;
    const last = audioArray.length - 1;
    context.moveTo(...getXY(audioArray[last]!, last));
    audioArray.forEach((value, index) => {
      context.lineTo(...getXY(value, index));
    });
    context.lineWidth = rin / 50;
    context.strokeStyle = color ?? "#fff";
    context.stroke();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, audioArray, color, margin]);

  useEffect(() => {
    if (playing) return;
    const images = mySavedTracks?.items
      .map((i) => i?.track?.album?.images?.at(0)?.url)
      .filter((s) => s);
    if (!images?.length) return;
    const updateKeepImage = () => {
      setKeepImage((k) => {
        const keeper = images
          .filter((i) => i !== k)
          .at(Math.floor(Math.random() * images.length));
        return keeper;
      });
    };
    updateKeepImage();
    const id = setInterval(() => {
      updateKeepImage();
    }, interval);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mySavedTracks]);

  if (!playbackState)
    return (
      <div className={styles.wrapper}>
        <div className={styles.keeper}>
          {keepImage ? (
            <img className={styles.background} src={keepImage} alt="" />
          ) : (
            <img
              className={`${styles.background} ${styles.logo}`}
              src={keepImage ? keepImage : spotify_logo.src ?? spotify_logo}
              alt=""
            />
          )}
        </div>
      </div>
    );

  const style = {
    top: `${margin.at(0)}px`,
    right: `${margin.at(1)}px`,
    bottom: `${margin.at(2)}px`,
    left: `${margin.at(3)}px`,
    width: `calc(50vmin - ${diff}px)`,
  };

  return (
    <div className={styles.wrapper}>
      <div className={playing ? styles.playing : styles.paused}>
        <img className={styles.background} src={image} alt="" />
        <canvas ref={canvas} className={styles.visualizer} />
        {image && (
          <img className={styles.disk} style={style} src={image} alt="" />
        )}
      </div>
    </div>
  );
};

export default Component;
