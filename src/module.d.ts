declare module "*.css";

declare module "*.png" {
	const path: { src: string };
	export default path;
}
