import type { FunctionComponent } from "react";

import { useEffect, useState, useRef } from "react";

import SpotifyWebApi from "spotify-web-api-js";

import Layout from "./layout";

const spotifyApi = new SpotifyWebApi();

type Props = {
  refresh_token: string | undefined;
  contents?: ("song" | "clock" | "user" | "control" | string | undefined)[]; //左上,右上,左下,右下
  progressbar?: "top" | "bottom" | "both" | string | undefined; //"top"|"bottom"|"both"|"none"
  margin?: number[]; //上,右,下,左
  domain?: string;
};
const Component: FunctionComponent<Props> = (props) => {
  const refresh_token = props.refresh_token;
  const contents = props.contents ?? ["song", "clock", "user", "control"];
  const progressbar = props.progressbar ?? "top";
  const margin = props.margin ?? [0, 0, 0, 0];
  const domain = props.domain ?? "";

  const valid = useRef(false);
  const [expires_at, setExpires_at] = useState<Date>();

  useEffect(() => {
    valid.current = true;
    setExpires_at(undefined);
  }, [refresh_token]);

  useEffect(() => {
    const checkToken = () => {
      if (!valid.current) return;
      if (expires_at && expires_at > new Date()) return;
      console.log("check", `"${refresh_token}"`);
      valid.current = false;
      (async () => {
        let data: any;
        try {
          const res = await fetch(
            `${domain}/api/spotify/access_token?refresh_token=${refresh_token}`
          );
          data = await res.json();
        } catch (_) {
          valid.current = true;
          return;
        }
        if (!data.access_token) {
          spotifyApi.setAccessToken(null);
          setExpires_at(undefined);
          console.log("invalid");
          return;
        }
        const access_token = data.access_token;
        spotifyApi.setAccessToken(access_token);
        const date = new Date();
        date.setSeconds(date.getSeconds() + data.expires_in - 60);
        setExpires_at(date);
        console.log(`expires_at: ${date}`);
        valid.current = true;
      })();
    };
    const id = setInterval(checkToken, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh_token, expires_at]);

  return (
    <Layout
      key={refresh_token}
      expires_at={expires_at}
      spotifyApi={spotifyApi}
      contents={contents}
      progressbar={progressbar}
      margin={margin}
    />
  );
};

export default Component;
