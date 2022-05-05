import React from "react";
import { render } from "react-dom";

import "./css/style.css";

import Layout from "./Layout";

function App() {
  const [refresh_token, setRefresh_token] = React.useState("");
  const [audioArray, setAudioArray] = React.useState(Array(128).fill(0));
  const [custom, setCustom] = React.useState({
    progressbar: true,
    song: true,
    clock: true,
    user: true,
    control: true
  });
  const customUpdate = (options) => {
    setCustom((custom) => {
      return {
        ...custom,
        ...options
      };
    });
  };

  React.useEffect(() => {
    window.wallpaperPropertyListener = {
      applyUserProperties: (properties) => {
        if (properties.refresh_token) {
          setRefresh_token(properties.refresh_token.value);
        }
        if (properties.progressbar) {
          customUpdate({
            progressbar: properties.progressbar.value
          });
        }
        if (properties.song) {
          customUpdate({
            song: properties.song.value
          });
        }
        if (properties.user) {
          customUpdate({
            user: properties.user.value
          });
        }
        if (properties.control) {
          customUpdate({
            control: properties.control.value
          });
        }
        if (properties.clock) {
          customUpdate({
            clock: properties.clock.value
          });
        }
      }
    };
    window.wallpaperRegisterAudioListener?.((array) => {
      setAudioArray(array.map(a => Math.min(a, 1)));
    });
  }, []);

  return (
    <React.Fragment>
      <Layout key={refresh_token} refresh_token={refresh_token} audioArray={audioArray} custom={custom} />
    </React.Fragment>
  );
}

render(<App />, document.getElementById("app"));