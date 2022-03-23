import * as React from "react";

import "../css/user.css";

import { valid } from "../js/api";
import test_icon from "../image/test/Spotify_Icon_RGB_Green.png";

export default function User(props) {
  const user = props.user;
  const test = props.test;

  const image = user?.images?.[0]?.url ?? test_icon;
  const name = test ? "User Name" : valid ? user?.display_name : "refresh_token error";

  return (
    <div className="user">
      <div className="holder">
        <img className="icon" src={image} />
        <div className="name">{name}</div>
      </div>
    </div>
  );
}