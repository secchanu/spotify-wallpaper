import type { FunctionComponent } from "react";
import type SpotifyWebApi from "spotify-web-api-js";

import { useState, useEffect } from "react";

import Background from "./background";
import Progress from "./progress";
import Song from "./song";
import Clock from "./clock";
import User from "./user";
import Control from "./control";
import Popup from "./popup";

import styles from "@/styles/app/spotify/wallpaper/layout.module.css";

type Props = {
  expires_at: Date | undefined;
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
  contents: ("song" | "clock" | "user" | "control" | string | undefined)[];
  progressbar: "top" | "bottom" | "both" | string;
  margin: number[];
};
const Component: FunctionComponent<Props> = (props) => {
  const expires_at = props.expires_at;
  const spotifyApi = props.spotifyApi;
  const contents = props.contents;
  const progressbar = props.progressbar;
  const margin = props.margin;

  const [playbackState, setPlaybackState] =
    useState<SpotifyApi.CurrentPlaybackResponse>();
  const [me, setMe] = useState<SpotifyApi.CurrentUsersProfileResponse>();
  const [mySavedTracks, setMySavedTracks] =
    useState<SpotifyApi.UsersSavedTracksResponse>();

  const isPremium = me?.product === "premium";

  useEffect(() => {
    if (!expires_at) {
      setPlaybackState(undefined);
      return;
    }
    const updateState = async () => {
      const state = await spotifyApi.getMyCurrentPlaybackState();
      setPlaybackState(state);
    };
    updateState();
    const id = setInterval(updateState, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expires_at]);

  useEffect(() => {
    if (!expires_at) {
      setMe(undefined);
      return;
    }
    (async () => {
      const user = await spotifyApi.getMe();
      setMe(user);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expires_at]);

  useEffect(() => {
    if (!expires_at) {
      setMySavedTracks(undefined);
      return;
    }
    (async () => {
      const saved = await spotifyApi.getMySavedTracks({ limit: 50 });
      setMySavedTracks(saved);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expires_at]);

  const getContent = (name: string | undefined, position: number) => {
    switch (name) {
      case "song":
        return (
          <Song
            position={position}
            margin={margin}
            playbackState={playbackState}
            contents={contents}
          />
        );
      case "clock":
        return <Clock position={position} />;
      case "user":
        return <User position={position} me={me} />;
      case "control":
        return (
          <Control
            position={position}
            playbackState={playbackState}
            spotifyApi={spotifyApi}
            isPremium={isPremium}
          />
        );
      default:
        return <div id={`position${position}`} about="none" />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <Background
          key={playbackState?.item?.id}
          margin={margin}
          playbackState={playbackState}
          mySavedTracks={mySavedTracks}
        />
      </div>
      <div
        className={styles.flow}
        style={{
          gridTemplate: `${margin.at(0)}px 1fr ${margin.at(2)}px / ${margin.at(
            3
          )}px 1fr ${margin.at(1)}px`,
        }}
      >
        <div className={styles.center}>
          <div className={styles.upper}>
            <div className={styles.contents}>
              {getContent(contents.at(0), 0)}
              {getContent(contents.at(1), 1)}
            </div>
            {["both", "top"].includes(progressbar) && (
              <div className={styles.edge}>
                <Progress
                  playbackState={playbackState}
                  spotifyApi={spotifyApi}
                  isPremium={isPremium}
                />
              </div>
            )}
          </div>
          <div className={styles.lower}>
            <div className={styles.contents}>
              {getContent(contents.at(2), 2)}
              {getContent(contents.at(3), 3)}
            </div>
            {["both", "bottom"].includes(progressbar) && (
              <div className={styles.edge}>
                <Progress
                  playbackState={playbackState}
                  spotifyApi={spotifyApi}
                  isPremium={isPremium}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.popup}>
        <Popup margin={margin} playbackState={playbackState} />
      </div>
    </div>
  );
};

export default Component;
