import * as React from "react";

import "../css/progressbar.css";

import { putSeek } from "../js/api.js";

export default function ProgressBar(props) {
  const state = props.state;
  const setProgress = props.setProgress;

  const progress_ms = state?.progress_ms;

  const [prog, setProg] = React.useState();

  const changeSeek = (v) => {
    if (v === undefined) return;
    putSeek(v);
    setProgress(v);
    setProg();
  }

  return (
    <div className="progressbar">
      <input className="bar" type="range" max={state?.item?.duration_ms ?? 1} value={prog ?? progress_ms} onChange={(e) => setProg(e.target.value)} onMouseUp={() => changeSeek(prog)} />
    </div>
  );
}