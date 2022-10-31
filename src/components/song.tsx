import type { FunctionComponent } from "react";

import { useState, useEffect, useRef } from "react";
import useViewSize from "./useViewSize";

import styles from "@/styles/app/spotify/wallpaper/song.module.css";

const msToStr = (ms: number) => {
  if (ms === undefined) return;
  const s = Math.floor(ms / 1000);
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  return `${("00" + minutes).slice(-2)}:${("00" + seconds).slice(-2)}`;
};

const longStr = (str: string) => {
  return `${str}　　　　　${str}　　　　　`;
};

type Props = {
  position: number;
  margin: number[];
  playbackState: SpotifyApi.CurrentPlaybackResponse | undefined;
  contents: ("song" | "clock" | "user" | "control" | string | undefined)[];
};
const Component: FunctionComponent<Props> = (props) => {
  const position = props.position;
  const margin = props.margin;
  const playbackState = props.playbackState;
  const contents = props.contents;

  const id = playbackState?.item?.id;
  const artist = playbackState?.item?.artists.map((a) => a.name).join(", ");
  const song = playbackState?.item?.name;
  const progress = playbackState?.progress_ms;
  const duration = playbackState?.item?.duration_ms;

  const [threshold, setThreshold] = useState(0);
  const [width, _] = useViewSize();
  const [isLongArtist, setIsLongArtist] = useState(false);
  const [isLongSong, setIsLongSong] = useState(false);

  const artistElem = useRef<HTMLDivElement>(null);
  const songElem = useRef<HTMLDivElement>(null);
  const progressElem = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!threshold) return;
    if (artistElem.current?.clientWidth) {
      setIsLongArtist(artistElem.current.clientWidth > threshold);
    }
    if (songElem.current?.clientWidth) {
      setIsLongSong(songElem.current.clientWidth > threshold);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, artist, song]);

  useEffect(() => {
    const next = position + (position % 2 ? -1 : 1);
    const neighborElem = document.getElementById(`position${next}`);
    const neighborType = neighborElem?.getAttribute("about");
    const space =
      width -
      (neighborType === "song" ? 0.5 * width : neighborElem?.clientWidth ?? 0) -
      (progressElem.current?.clientWidth ?? 0) -
      ((margin.at(1) ?? 0) + (margin.at(3) ?? 0)) -
      60;
    setThreshold(space);
  }, [contents, width, position, margin, duration]);

  if (!id)
    return (
      <div
        id={`position${position}`}
        className={`${styles.wrapper} ${styles[`position${position}`]}`}
        about="song"
      ></div>
    );

  return (
    <div
      id={`position${position}`}
      className={`${styles.wrapper} ${styles[`position${position}`]}`}
      about="song"
    >
      <div className={styles.item}>
        <div
          className={styles.artist}
          style={{ width: isLongArtist ? `${threshold}px` : undefined }}
        >
          <div
            ref={artistElem}
            className={isLongArtist ? styles.obj : styles.str}
          >
            {artist}
          </div>
          {isLongArtist && (
            <div className={styles.long}>{longStr(artist!)}</div>
          )}
        </div>
        <div
          className={styles.song}
          style={{ width: isLongSong ? `${threshold}px` : undefined }}
        >
          <div ref={songElem} className={isLongSong ? styles.obj : styles.str}>
            {song}
          </div>
          {isLongSong && <div className={styles.long}>{longStr(song!)}</div>}
        </div>
      </div>
      <div ref={progressElem} className={styles.progress}>
        {msToStr(progress!)} / {msToStr(duration!)}
      </div>
    </div>
  );
};

export default Component;
