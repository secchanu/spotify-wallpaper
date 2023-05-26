import { useEffect, useState } from "react";

const useWindowSize = () => {
	const [audioArray, setAudioArray] = useState<number[]>(Array(128).fill(0));

	useEffect(() => {
		window.wallpaperRegisterAudioListener?.((array: number[]) => {
			const audioArray = array.map((a) => Math.min(a, 1));
			setAudioArray([
				...audioArray.slice(0, 64),
				...audioArray.slice(64, 128).reverse(),
			]);
		});
	}, []);

	return audioArray;
};

export default useWindowSize;
