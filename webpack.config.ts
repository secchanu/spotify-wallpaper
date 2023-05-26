import HtmlPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import webpack from "webpack";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

const config: webpack.Configuration = {
	mode: "production",
	resolve: {
		extensions: [".js", ".ts", ".tsx", ".json"],
		plugins: [new TsconfigPathsPlugin()],
	},
	entry: "./src/index.tsx",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].js",
		publicPath: "",
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					"babel-loader",
					{
						loader: "ts-loader",
						options: {
							transpileOnly: true,
							configFile: path.resolve(__dirname, "src/tsconfig.json"),
						},
					},
				],
			},
			{
				test: /\.(png|jpe?g|gif|webm|svg|woff2?)$/,
				loader: "file-loader",
				options: { name: "[name].[ext]" },
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							modules: {
								exportLocalsConvention: "camelCase",
							},
							sourceMap: true,
						},
					},
				],
			},
		],
	},
	plugins: [
		new HtmlPlugin({
			filename: `index.html`,
			template: `webpack/index.html`,
		}),
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css",
		}),
	],
};

export default config;
