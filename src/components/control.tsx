import type { FunctionComponent } from "react";
import type SpotifyWebApi from "spotify-web-api-js";

import { useState, useEffect, useRef } from "react";

import styles from "../styles/control.module.css";

const repeatStates = ["off", "context", "track"];
const getRepeatState = (repeat?: number) => {
	const repeatState = repeatStates[(repeat ?? 0) % repeatStates.length] as
		| "off"
		| "track"
		| "context";
	return repeatState;
};
const getRepeatStr = (repeat?: number) => {
	const repeatState = getRepeatState(repeat);
	switch (repeatState) {
		case "off":
			return "repeat";
		case "track":
			return "repeat_one_on";
		case "context":
			return "repeat_on";
		default:
			return "repeat";
	}
};

type Props = {
	position: number;
	playbackState: SpotifyApi.CurrentPlaybackResponse | undefined;
	spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
	isPremium: boolean;
};
const Component: FunctionComponent<Props> = (props) => {
	const position = props.position;
	const playbackState = props.playbackState;
	const spotifyApi = props.spotifyApi;
	const isPremium = props.isPremium;

	const [panelState, setPanelState] = useState<{
		shuffle?: boolean;
		play?: boolean;
		repeat?: number;
	}>({});
	const [volume, setVolume] = useState(0);
	const [vol, setVol] = useState<number>();
	const ignore = useRef(false);

	useEffect(() => {
		if (ignore.current) return;
		const repeatNum = repeatStates.findIndex(
			(s) => s === playbackState?.repeat_state,
		);
		setPanelState({
			shuffle: playbackState?.shuffle_state,
			play: playbackState?.is_playing,
			repeat: repeatNum === -1 ? undefined : repeatNum,
		});
	}, [playbackState]);

	useEffect(() => {
		if (ignore.current) return;
		setVolume(playbackState?.device?.volume_percent ?? 0);
	}, [playbackState]);

	return (
		<div
			id={`position${position}`}
			className={`${styles.wrapper} ${styles[`position${position}`]}`}
			about="control"
		>
			<div
				className={
					!isPremium || !playbackState ? styles.disabled : styles.enabled
				}
			>
				<div className={styles.panel}>
					<div
						className={styles.shuffle}
						onClick={async () => {
							ignore.current = true;
							setPanelState((prev) => {
								return { ...prev, shuffle: !prev.shuffle };
							});
							await spotifyApi.setShuffle(!panelState.shuffle).catch(() => {});
							ignore.current = false;
						}}
					>
						<span className={`material-symbols-outlined ${styles.icon}`}>
							{panelState.shuffle ? "shuffle_on" : "shuffle"}
						</span>
					</div>
					<div
						className={styles.previous}
						onClick={() => spotifyApi.skipToPrevious().catch(() => {})}
					>
						<span className={`material-symbols-outlined ${styles.icon}`}>
							skip_previous
						</span>
					</div>
					<div
						className={styles.play}
						onClick={async () => {
							ignore.current = true;
							setPanelState((prev) => {
								return { ...prev, play: !prev.play };
							});
							await (panelState.play
								? spotifyApi.pause().catch(() => {})
								: spotifyApi.play().catch(() => {}));
							ignore.current = false;
						}}
					>
						<span className={`material-symbols-outlined ${styles.icon}`}>
							{panelState.play ? "pause_circle" : "play_circle"}
						</span>
					</div>
					<div
						className={styles.next}
						onClick={() => spotifyApi.skipToNext().catch(() => {})}
					>
						<span className={`material-symbols-outlined ${styles.icon}`}>
							skip_next
						</span>
					</div>
					<div
						className={styles.repeat}
						onClick={async () => {
							ignore.current = true;
							const repeatNum =
								((panelState.repeat ?? 0) + 1) % repeatStates.length;
							setPanelState((prev) => {
								return { ...prev, repeat: repeatNum };
							});
							await spotifyApi
								.setRepeat(getRepeatState(repeatNum))
								.catch(() => {});
							ignore.current = false;
						}}
					>
						<span className={`material-symbols-outlined ${styles.icon}`}>
							{getRepeatStr(panelState.repeat)}
						</span>
					</div>
				</div>
				<div className={styles.volume}>
					<span className={`material-symbols-outlined ${styles.icon}`}>
						{(vol ?? volume) ? "volume_up" : "volume_off"}
					</span>
					<input
						type="range"
						className={styles.bar}
						disabled={
							!isPremium ||
							playbackState?.device?.volume_percent === undefined ||
							["Smartphone"].includes(playbackState.device.type)
						}
						value={vol ?? volume}
						max={100}
						onChange={(e) => setVol(Number(e.target.value))}
						onMouseDown={() => {
							ignore.current = true;
						}}
						onMouseLeave={async () => {
							if (vol === undefined) return;
							setVolume(vol);
							await spotifyApi.setVolume(vol).catch(() => {});
							ignore.current = false;
							setVol(undefined);
						}}
						onMouseUp={async () => {
							if (vol === undefined) return;
							setVolume(vol);
							await spotifyApi.setVolume(vol).catch(() => {});
							ignore.current = false;
							setVol(undefined);
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default Component;
