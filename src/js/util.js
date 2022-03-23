import * as Vibrant from "node-vibrant";

export async function getColor(path) {
  if (!path) return;
  const palette = await Vibrant.from(path).getPalette();
  return palette["Muted"].getHex();
}