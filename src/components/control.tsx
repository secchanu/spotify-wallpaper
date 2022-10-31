import type { FunctionComponent } from "react";
import type SpotifyWebApi from "spotify-web-api-js";

import { useState, useEffect } from "react";

import styles from "@/styles/app/spotify/wallpaper/control.module.css";

const repeatStates = ["off", "context", "track"];
const getRepeatState = (repeat?: number) => {
  const repeatState = repeatStates[(repeat ?? 0) % repeatStates.length] as
    | "off"
    | "track"
    | "context";
  return repeatState;
};
const getRepeatStr = (repeat?: number) => {
  const repeatState = getRepeatState(repeat);
  switch (repeatState) {
    case "off":
      return "repeat";
    case "track":
      return "repeat_one_on";
    case "context":
      return "repeat_on";
    default:
      return "repeat";
  }
};

type Props = {
  position: number;
  playbackState: SpotifyApi.CurrentPlaybackResponse | undefined;
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
  isPremium: boolean;
};
const Component: FunctionComponent<Props> = (props) => {
  const position = props.position;
  const playbackState = props.playbackState;
  const spotifyApi = props.spotifyApi;
  const isPremium = props.isPremium;

  const [shuffle, setShuffle] = useState<boolean>();
  const [play, setPlay] = useState<boolean>();
  const [repeat, setRepeat] = useState<number>();
  const [volume, setVolume] = useState(0);
  const [vol, setVol] = useState<number>();
  const [ignore, setIgnore] = useState(false);

  useEffect(() => {
    if (ignore) return;
    setShuffle(playbackState?.shuffle_state);
    setPlay(playbackState?.is_playing);
    const repeatNum = repeatStates.findIndex(
      (s) => s === playbackState?.repeat_state
    );
    setRepeat(repeatNum === -1 ? undefined : repeatNum);
    setVolume(playbackState?.device?.volume_percent ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playbackState]);

  return (
    <div
      id={`position${position}`}
      className={`${styles.wrapper} ${styles[`position${position}`]}`}
      about="control"
    >
      <div
        className={
          !isPremium || !playbackState ? styles.disabled : styles.enabled
        }
      >
        <div className={styles.panel}>
          <div
            className={styles.shuffle}
            onClick={async () => {
              setIgnore(true);
              setShuffle(!shuffle);
              await spotifyApi.setShuffle(!shuffle).catch(() => {});
              setIgnore(false);
            }}
          >
            <span className={`material-symbols-outlined ${styles.icon}`}>
              {shuffle ? "shuffle_on" : "shuffle"}
            </span>
          </div>
          <div
            className={styles.previous}
            onClick={() => spotifyApi.skipToPrevious().catch(() => {})}
          >
            <span className={`material-symbols-outlined ${styles.icon}`}>
              skip_previous
            </span>
          </div>
          <div
            className={styles.play}
            onClick={async () => {
              setIgnore(true);
              setPlay(!play);
              await (play
                ? spotifyApi.pause().catch(() => {})
                : spotifyApi.play().catch(() => {}));
              setIgnore(false);
            }}
          >
            <span className={`material-symbols-outlined ${styles.icon}`}>
              {play ? "pause_circle" : "play_circle"}
            </span>
          </div>
          <div
            className={styles.next}
            onClick={() => spotifyApi.skipToNext().catch(() => {})}
          >
            <span className={`material-symbols-outlined ${styles.icon}`}>
              skip_next
            </span>
          </div>
          <div
            className={styles.repeat}
            onClick={async () => {
              setIgnore(true);
              const repeatNum = ((repeat ?? 0) + 1) % repeatStates.length;
              setRepeat(repeatNum);
              await spotifyApi
                .setRepeat(getRepeatState(repeatNum))
                .catch(() => {});
              setIgnore(false);
            }}
          >
            <span className={`material-symbols-outlined ${styles.icon}`}>
              {getRepeatStr(repeat)}
            </span>
          </div>
        </div>
        <div
          className={styles.volume}
          onMouseDown={() => {
            setIgnore(true);
          }}
          onMouseLeave={async () => {
            if (vol === undefined) return;
            setVolume(vol);
            await spotifyApi.setVolume(vol).catch(() => {});
            setIgnore(false);
            setVol(undefined);
          }}
          onMouseUp={async () => {
            if (vol === undefined) return;
            setVolume(vol);
            await spotifyApi.setVolume(vol).catch(() => {});
            setIgnore(false);
            setVol(undefined);
          }}
        >
          <span className={`material-symbols-outlined ${styles.icon}`}>
            {vol ?? volume ? "volume_up" : "volume_off"}
          </span>
          <input
            type="range"
            className={styles.bar}
            disabled={
              !isPremium ||
              playbackState?.device?.volume_percent === undefined ||
              ["Smartphone"].includes(playbackState.device.type)
            }
            value={vol ?? volume}
            max={100}
            onChange={(e) => setVol(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default Component;
