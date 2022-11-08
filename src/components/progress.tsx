import type { FunctionComponent } from "react";
import type SpotifyWebApi from "spotify-web-api-js";

import { useState, useEffect, useRef } from "react";

import styles from "@/styles/app/spotify/wallpaper/progress.module.css";

type Props = {
  playbackState: SpotifyApi.CurrentPlaybackResponse | undefined;
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
  isPremium: boolean;
};
const Component: FunctionComponent<Props> = (props) => {
  const playbackState = props.playbackState;
  const spotifyApi = props.spotifyApi;
  const isPremium = props.isPremium;

  const duration = playbackState?.item?.duration_ms;

  const [progress, setProgress] = useState(0);
  const [prog, setProg] = useState<number>();
  const ignore = useRef(false);

  useEffect(() => {
    if (ignore.current) return;
    setProgress(playbackState?.progress_ms ?? 0);
  }, [playbackState]);

  return (
    <div className={styles.wrapper}>
      <input
        type="range"
        className={styles.bar}
        disabled={!isPremium || !playbackState?.item?.duration_ms}
        value={prog ?? progress}
        max={duration ?? 1}
        onChange={(e) => setProg(Number(e.target.value))}
        onMouseDown={() => {
          ignore.current = true;
        }}
        onMouseLeave={async () => {
          if (prog === undefined) return;
          setProgress(prog);
          await spotifyApi.seek(prog).catch(() => {});
          ignore.current = false;
          setProg(undefined);
        }}
        onMouseUp={async () => {
          if (prog === undefined) return;
          setProgress(prog);
          await spotifyApi.seek(prog).catch(() => {});
          ignore.current = false;
          setProg(undefined);
        }}
      />
    </div>
  );
};

export default Component;
