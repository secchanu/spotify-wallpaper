declare module "*.css";

declare module "*.png" {
  const path: string;
  export default path;
}
