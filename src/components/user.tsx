import type { FunctionComponent } from "react";

import styles from "../styles/user.module.css";

type Props = {
	position: number;
	me: SpotifyApi.CurrentUsersProfileResponse | undefined;
};
const Component: FunctionComponent<Props> = (props) => {
	const position = props.position;
	const me = props.me;

	const icon = me?.images?.at(0)?.url;
	const name = me?.display_name;

	return (
		<div
			id={`position${position}`}
			className={`${styles.wrapper} ${styles[`position${position}`]}`}
			about="user"
		>
			{icon && (
				<>
					<div className={styles.name}>{name}</div>
					<img className={styles.icon} src={icon} alt="" />
				</>
			)}
		</div>
	);
};

export default Component;
