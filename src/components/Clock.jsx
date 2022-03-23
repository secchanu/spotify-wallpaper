import * as React from "react";

import "../css/clock.css";

const interval = 500;

function getClock() {
  const weeks = new Array("Sun", "Mon", "Thu", "Wed", "Thr", "Fri", "Sat");
  const now = new Date();
  const y = now.getFullYear();
  const mo = ("00" + (now.getMonth() + 1)).slice(-2);
  const d = ("00" + now.getDate()).slice(-2);
  const w = weeks[now.getDay()];
  const h = ("00" + now.getHours()).slice(-2);
  const mi = ("00" + now.getMinutes()).slice(-2);
  const date = `${y}/${mo}/${d} (${w}) `;
  const time = `${h}:${mi}`;
  return {date, time};
}

export default function Song(props) {
  const [now, setNow] = React.useState(getClock())

  React.useEffect(() => {
    const setClock = () => {
      const clock = getClock();
      setNow(clock);
    }
    const intervalId = setInterval(setClock, interval);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="clock">
      <div className="date">{now.date}</div>
      <div className="time">{now.time}</div>
    </div>
  );
}