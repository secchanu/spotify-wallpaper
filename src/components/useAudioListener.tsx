import { useEffect, useState } from "react";

const useWindowSize = () => {
  const [audioArray, setAudioArray] = useState<number[]>(Array(128).fill(0));

  useEffect(() => {
    window.wallpaperRegisterAudioListener?.((array: number[]) => {
      setAudioArray(array.map((a) => Math.min(a, 1)));
    });
  }, []);

  return audioArray;
};

export default useWindowSize;
