import * as React from "react";

import "../css/popup.css";

const timeout = 3 * 1000;

export default function Popup(props) {
  const state = props.state;
  const oldItem = props.oldItem;
  const setOldItem = props.setOldItem;

  const newItem = state?.item;

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setOldItem();
    }, timeout);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="popup">
      <div className="item old">
        {oldItem?.album?.images?.[0]?.url && <img src={oldItem?.album?.images?.[0]?.url} />}
      </div>
      <div className="item new">
        {newItem?.album?.images?.[0]?.url && <img src={newItem?.album?.images?.[0]?.url} />}
      </div>
    </div>
  );
}