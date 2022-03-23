import * as React from "react";

import "../css/control.css";

import shuffle_off from "../image/icon/shuffle_white_24dp.svg";
import shuffle_on from "../image/icon/shuffle_on_white_24dp.svg";
import previous from "../image/icon/skip_previous_white_24dp.svg";
import play from "../image/icon/play_circle_white_24dp.svg";
import pause from "../image/icon/pause_circle_white_24dp.svg";
import next from "../image/icon/skip_next_white_24dp.svg";
import repeat_off from "../image/icon/repeat_white_24dp.svg";
import repeat_on from "../image/icon/repeat_on_white_24dp.svg";
import repeat_one_on from "../image/icon/repeat_one_on_white_24dp.svg";
import volume_off from "../image/icon/volume_off_white_24dp.svg";
import volume_down from "../image/icon/volume_down_white_24dp.svg";
import volume_up from "../image/icon/volume_up_white_24dp.svg";

import { putPause, putPlay, postPrevious, postNext, putShuffle, putRepeat, putVolume } from "../js/api.js";

export default function User(props) {
  const state = props.state;
  const setShuffle = props.setShuffle;
  const setPlaying = props.setPlaying;
  const setRepeat = props.setRepeat;
  const setVolume = props.setVolume;

  const disable = state?.is_playing === undefined;
  const volume_percent = state?.device?.volume_percent ?? 0;

  const [vol, setVol] = React.useState();

  const changeVolume = (v) => {
    if (v === undefined) return;
    putVolume(v);
    setVolume(v);
    setVol();
  }

  return (
    <div className="control">
      <div className={disable ? "panel disabled" : "panel"}>
        <div className="shuffle">
          {state?.shuffle_state
            ? <img src={shuffle_on} onClick={disable ? () => { } : () => { putShuffle(false); setShuffle(false); }} />
            : <img src={shuffle_off} onClick={disable ? () => { } : () => { putShuffle(true); setShuffle(true); }} />}
        </div>
        <div className="previous">
          <img src={previous} onClick={disable ? () => { } : postPrevious}/>
        </div>
        <div className="play">
          {state?.is_playing
            ? <img src={pause} onClick={disable ? () => { } : () => { putPause(); setPlaying(false); }} />
            : <img src={play} onClick={disable ? () => { } : () => { putPlay(); setPlaying(true); }} />}
        </div>
        <div className="next">
          <img src={next} onClick={disable ? () => { } : postNext}/>
        </div>
        <div className="repeat" >
          {(state?.repeat_state) === "context"
            ? <img src={repeat_on} onClick={disable ? () => { } : () => { putRepeat("track"); setRepeat("track"); }} />
            : (state?.repeat_state) === "track"
              ? <img src={repeat_one_on} onClick={disable ? () => { } : () => { putRepeat("off"); setRepeat("off"); }} />
              : <img src={repeat_off} onClick={disable ? () => { } : () => { putRepeat("context"); setRepeat("context"); }} /> }
        </div>
      </div>
      <div className={disable ? "volume disabled" : "volume"}>
        <img src={(vol ?? volume_percent) === 0 ? volume_off : (vol ?? volume_percent) < 50 ? volume_down : volume_up} onClick={disable ? () => { } : () => { changeVolume(0)}} />
        <input className="bar" type="range" value={vol ?? volume_percent} onChange={(e) => setVol(e.target.value)} onMouseUp={() => changeVolume(vol)}/>
      </div>
    </div>
  );
}