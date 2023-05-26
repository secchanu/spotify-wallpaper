import type { FunctionComponent } from "react";

import { useState, useRef } from "react";
import useViewSize from "./useViewSize";

import styles from "../styles/popup.module.css";

type Props = {
	margin: number[];
	domain: string;
	playbackState: SpotifyApi.CurrentPlaybackResponse | undefined;
};
const Component: FunctionComponent<Props> = (props) => {
	const margin = props.margin;
	const domain = props.domain;
	const playbackState = props.playbackState;

	const item = playbackState?.item;

	const [oldItem, setOldItem] = useState<SpotifyApi.TrackObjectFull | null>();
	const prevItem = useRef<SpotifyApi.TrackObjectFull | null>();
	const [width, height] = useViewSize();

	if (item?.id !== prevItem.current?.id) {
		setOldItem(prevItem.current);
		prevItem.current = item;
	}

	const minDir = Number(width < height);
	const style = {
		top: `${margin.at(0)}px`,
		right: `${margin.at(1)}px`,
		bottom: `${margin.at(2)}px`,
		left: `${margin.at(3)}px`,
		width: `calc(50vmin - ${
			margin.filter((_, i) => i % 2 === minDir).reduce((acc, m) => acc + m, 0) /
			2
		}px)`,
	};

	if (!item?.id && !oldItem?.id)
		return (
			<div className={styles.screen}>
				<div className={styles.bg}>
					<div
						className={styles.splash}
						style={{
							...style,
							width: undefined,
						}}
					>
						<div className={styles.text}>made by</div>
						<img
							className={styles.icon}
							src={`${domain}/icon.gif`}
							alt="secchanu"
						/>
					</div>
				</div>
			</div>
		);

	const oldImage = oldItem?.album.images.at(0)?.url;
	const image = item?.album.images.at(0)?.url;

	return (
		<div key={item?.id} className={styles.wrapper}>
			<div className={styles.cover} />
			{oldImage && (
				<img className={styles.old} style={style} src={oldImage} alt="" />
			)}
			{image && <img className={styles.new} style={style} src={image} alt="" />}
		</div>
	);
};

export default Component;
