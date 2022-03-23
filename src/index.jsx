import React from "react";
import { render } from "react-dom";

import "./css/style.css";

import Layout from "./Layout";

function App() {
  const [refresh_token, setRefresh_token] = React.useState("");
  const [audioArray, setAudioArray] = React.useState(Array(128));

  React.useEffect(() => {
    window.wallpaperPropertyListener = {
      applyUserProperties: (properties) => {
        if (properties.refresh_token) {
          setRefresh_token(properties.refresh_token.value);
        }
      }
    };
    window.wallpaperRegisterAudioListener?.((array) => {
      setAudioArray(array.map(a => Math.min(a, 1)));
    });
  }, []);

  return (
    <React.Fragment>
      <Layout key={refresh_token} refresh_token={refresh_token} audioArray={audioArray} />
    </React.Fragment>
  );
}

render(<App />, document.getElementById("app"));