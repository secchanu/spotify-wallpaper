import * as React from "react";

import "../css/song.css";

function msToStr(ms) {
  if (ms === undefined) return;
  const s = Math.floor(ms / 1000);
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  return `${("00" + minutes).slice(-2)}:${("00" + seconds).slice(-2)}`;
}

function getLongStr(str) {
  return `${str}　　　　　${str}　　　　　`;
}

export default function Song(props) {
  const state = props.state;
  const test = props.test;

  const artists = test ? "Artists" : state?.item?.artists?.map(a => a.name)?.join(", ");
  const title = test ? "Song Title" : state?.item?.name;
  const progress_ms = test ? 569000 : state?.progress_ms;
  const duration_ms = test ? 754000 : state?.item?.duration_ms;

  React.useEffect(() => {
    const vw = document.documentElement.clientWidth;
    const scrollable = [
      {
        elm: document.getElementById("artists"),
        str: artists
      },
      {
        elm: document.getElementById("title"),
        str: title
      }
    ];
    scrollable.forEach(obj => {
      if (obj.elm.clientWidth < 0.4 * vw) return;
      obj.elm.className = `${obj.elm.id} scroll`;
      obj.elm.firstChild.innerHTML = getLongStr(obj.str);
    });
    
  }, []);

  return (
    <div className="song">
      <div className="item">
        <div id="artists" className="artists">
          <p>{artists}</p>
        </div>
        <div id="title" className="title">
          <p>{title}</p>
        </div>
      </div>
      <div className="progress">{msToStr(progress_ms)} / {msToStr(duration_ms)}</div>
    </div>
  );
}