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
  const expires_at = useRef<number>();
  const [token, setToken] = useState<string | null>(null);

  spotifyApi.setAccessToken(token);

  useEffect(() => {
    valid.current = true;
    expires_at.current = undefined;
    const checkToken = () => {
      if (!valid.current) return;
      const date = new Date();
      if (expires_at.current && expires_at.current > date.getTime()) return;
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
        const access_token = data?.access_token;
        if (!access_token) {
          setToken(null);
          expires_at.current = undefined;
          console.log("invalid");
          return;
        }
        setToken(access_token);
        date.setSeconds(date.getSeconds() + data.expires_in - 60);
        expires_at.current = date.getTime();
        console.log(`expires_at: ${date}`);
        valid.current = true;
      })();
    };
    const id = setInterval(checkToken, 1000);
    return () => {
      clearInterval(id);
    };
  }, [refresh_token, domain]);

  return (
    <Layout
      key={refresh_token}
      token={token}
      spotifyApi={spotifyApi}
      contents={contents}
      progressbar={progressbar}
      margin={margin}
    />
  );
};

export default Component;
