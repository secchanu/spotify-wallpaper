import * as React from "react";

import { valid, setToken, getPlayer, getUser, getTracks } from "./js/api.js";
import { getColor } from "./js/util.js";

import "./css/layout.css";

import Background from "./components/Background";
import ProgressBar from "./components/ProgressBar";
import Song from "./components/Song";
import User from "./components/User";
import Control from "./components/Control";
import Clock from "./components/Clock";
import Popup from "./components/Popup";

const interval = 1 * 1000;

export default function Layout(props) {
  const refresh_token = props.refresh_token;
  const audioArray = props.audioArray;
  const custom = props.custom;

  const test = !refresh_token;

  const [state, setState] = React.useState();
  const [user, setUser] = React.useState();
  const [color, setColor] = React.useState();
  const [oldItem, setOldItem] = React.useState();
  const [saved, setSaved] = React.useState();

  let item;
  const getState = async () => {
    const player = await getPlayer();
    if (player?.item?.id) {
      const changed = item?.id !== player.item.id;
      if (changed) {
        setOldItem(item);
        item = player.item;
        setColor(await getColor(player.item.album.images[0].url));
      }
    }
    setState(player);
  }

  React.useEffect(() => {
    (async () => {
      await setToken(refresh_token);
    })();
  }, []);

  React.useEffect(() => {
    if (test) return;
    (async () => {
      await getState();
      setUser(await getUser());
      setSaved(await getTracks(50));
    })();
    const intervalId = setInterval(getState, interval);
    return () => {
      clearInterval(intervalId);
    };
  }, [valid]);

  const setProgress = (s) => {
    const newState = {
      ...state,
      progress_ms: s
    };
    setState(newState);
  }
  const setShuffle = (s) => {
    const newState = {
      ...state,
      shuffle_state: s
    };
    setState(newState);
  };
  const setPlaying = (s) => {
    const newState = {
      ...state,
      is_playing: s
    };
    setState(newState);
  };
  const setRepeat = (s) => {
    const newState = {
      ...state,
      repeat_state: s
    };
    setState(newState);
  };
  const setVolume = (s) => {
    const newState = {
      ...state,
    };
    newState.device.volume_percent = s;
    setState(newState);
  };


  return (
    <div className="container">
      <Background state={state} audioArray={audioArray} color={color} saved={saved} test={test} />
      {custom.progressbar && <ProgressBar state={state} setProgress={setProgress} />}
      {custom.song && ((state?.item?.id || test) && <Song key={state?.item?.id} state={state} test={test} />)}
      {custom.user && <User key={user?.id} user={user} test={test} />}
      {custom.control && <Control state={state} setShuffle={setShuffle} setPlaying={setPlaying} setRepeat={setRepeat} setVolume={setVolume} />}
      {oldItem && <Popup state={state} oldItem={oldItem} setOldItem={setOldItem} />}
      {custom.clock && <Clock />}
    </div>
  );
}