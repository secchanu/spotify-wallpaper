import type { FunctionComponent } from "react";

import { useState, useEffect } from "react";

import styles from "@/styles/app/spotify/wallpaper/clock.module.css";

const interval = 500;

const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getClock = () => {
  const now = new Date();
  const y = now.getFullYear();
  const mo = ("00" + (now.getMonth() + 1)).slice(-2);
  const d = ("00" + now.getDate()).slice(-2);
  const w = weeks[now.getDay()];
  const h = ("00" + now.getHours()).slice(-2);
  const mi = ("00" + now.getMinutes()).slice(-2);
  const date = `${y}/${mo}/${d} (${w}) `;
  const time = `${h}:${mi}`;
  return { date, time };
};

type Props = {
  position: number;
};
const Component: FunctionComponent<Props> = (props) => {
  const position = props.position;

  const [now, setNow] = useState(getClock());

  useEffect(() => {
    const setClock = () => {
      const clock = getClock();
      setNow(clock);
    };
    const id = setInterval(setClock, interval);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <div
      id={`position${position}`}
      className={`${styles.wrapper} ${styles[`position${position}`]}`}
      about="clock"
    >
      <div className={styles.clock}>
        <div className={styles.date}>{now.date}</div>
        <div className={styles.time}>{now.time}</div>
      </div>
    </div>
  );
};

export default Component;
