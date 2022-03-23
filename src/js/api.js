import axios from "axios";

let rtoken = "";
export let valid;

const instance = axios.create({
  baseURL: "https://api.spotify.com/v1"
});

export async function setToken(refresh_token) {
  if (!refresh_token) return;
  rtoken = refresh_token;
  const url = "https://script.google.com/macros/s/AKfycbzKhUbyW0miarZYNh9ajds_eZtdboX9stxB0eB_EW5fyAEGXxP03d0hNsLWqvq7BI4/exec";
  const params = {
    refresh_token: rtoken,
    crossDomain: true
  }
  const res = await axios.get(url, { params });
  const token = res.data;
  valid = Boolean(token);
  console.log(`Token: ${valid}`);
  if (valid) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  return valid;
}

instance.interceptors.response.use(
  response => response,
  async error => {
    switch (error.response?.status) {
      case 401:
        await updateToken();
    }
    return false;
  }
);

async function updateToken() {
  console.log("update");
  const update = await setToken(rtoken);
  return update;
}

export async function getUser() {
  if (!valid) return;
  const url = "/me";
  const res = await instance.get(url);
  return res.data;
}

export async function getPlayer() {
  if (!valid) return;
  const url = "/me/player";
  const res = await instance.get(url);
  return res.data;
}

export async function getTracks(limit) {
  if (!valid) return;
  const url = `/me/tracks?limit=${limit}`;
  const res = await instance.get(url);
  return res.data;
}

export async function putPlay() {
  if (!valid) return;
  const url = "/me/player/play";
  await instance.put(url);
}

export async function putPause() {
  if (!valid) return;
  const url = "/me/player/pause";
  await instance.put(url);
}

export async function postPrevious() {
  if (!valid) return;
  const url = "/me/player/previous";
  await instance.post(url);
}

export async function postNext() {
  if (!valid) return;
  const url = "/me/player/next";
  await instance.post(url);
}

export async function putShuffle(state) {
  if (!valid) return;
  const url = `/me/player/shuffle?state=${state}`;
  await instance.put(url);
}

export async function putRepeat(state) {
  if (!valid) return;
  const url = `/me/player/repeat?state=${state}`;
  await instance.put(url);
}

export async function putVolume(volume_percent) {
  if (!valid) return;
  const url = `/me/player/volume?volume_percent=${volume_percent}`;
  await instance.put(url);
}

export async function putSeek(position_ms) {
  if (!valid) return;
  const url = `/me/player/seek?position_ms=${position_ms}`;
  await instance.put(url);
}