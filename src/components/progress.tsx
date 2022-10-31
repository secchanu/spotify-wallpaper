import type { FunctionComponent } from "react";
import type SpotifyWebApi from "spotify-web-api-js";

import { useState, useEffect } from "react";

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
  const [ignore, setIgnore] = useState(false);

  useEffect(() => {
    if (ignore) return;
    setProgress(playbackState?.progress_ms ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playbackState]);

  return (
    <div
      className={styles.wrapper}
      onMouseDown={() => {
        setIgnore(true);
      }}
      onMouseLeave={async () => {
        if (prog === undefined) return;
        setProgress(prog);
        await spotifyApi.seek(prog).catch(() => {});
        setIgnore(false);
        setProg(undefined);
      }}
      onMouseUp={async () => {
        if (prog === undefined) return;
        setProgress(prog);
        await spotifyApi.seek(prog).catch(() => {});
        setIgnore(false);
        setProg(undefined);
      }}
    >
      <input
        type="range"
        className={styles.bar}
        disabled={!isPremium || !playbackState?.item?.duration_ms}
        value={prog ?? progress}
        max={duration ?? 1}
        onChange={(e) => setProg(Number(e.target.value))}
      />
    </div>
  );
};

export default Component;
