import type { FunctionComponent } from "react";

import { useState, useEffect, useRef } from "react";

import SpotifyWebApi from "spotify-web-api-js";

import Layout from "./layout";

const spotifyApi = new SpotifyWebApi();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Props = {
  refresh_token: string | undefined;
  contents?: ("song" | "clock" | "user" | "control" | string | undefined)[]; //左上,右上,左下,右下
  progressbar?: "top" | "bottom" | "both" | string | undefined; //"top"|"bottom"|"both"|"none"
  margin?: number[]; //上,右,下,左
  audioArray?: number[]; //length = 128
  domain?: string;
};
const Component: FunctionComponent<Props> = (props) => {
  const refresh_token = props.refresh_token;
  const contents = props.contents ?? ["song", "clock", "user", "control"];
  const progressbar = props.progressbar ?? "top"; //"top"|"bottom"|"both"|"none"
  const margin = props.margin ?? [0, 0, 0, 0]; //上,右,下,左
  const audioArray = props.audioArray ?? Array(128).fill(0); //length = 128
  const domain = props.domain ?? "";

  const worker = useRef<NodeJS.Timeout>();
  const [valid, setValid] = useState(false);

  const updateToken = async () => {
    if (!refresh_token) {
      setValid(false);
      return;
    }
    let data: any;
    do {
      try {
        const res = await fetch(
          `${domain}/api/spotify/access_token?refresh_token=${refresh_token}`
        );
        data = await res.json();
      } catch (error) {
        await sleep(10000);
      }
    } while (!data);
    if (!data.access_token) {
      setValid(false);
      return;
    }
    const access_token = data.access_token;
    spotifyApi.setAccessToken(access_token);
    const id: NodeJS.Timeout = setTimeout(
      () => updateToken(),
      data.expires_in * 1000
    );
    setValid(true);
    worker.current = id;
  };

  useEffect(() => {
    updateToken();
    return () => clearTimeout(worker.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh_token]);

  return (
    <Layout
      key={Number(valid)}
      spotifyApi={spotifyApi}
      contents={contents}
      progressbar={progressbar}
      margin={margin}
      audioArray={audioArray}
    />
  );
};

export default Component;
