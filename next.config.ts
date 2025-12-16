import type { NextConfig } from "next/dist/server/config-shared";

const nextConfig: NextConfig = {
	// Load shader files as raw strings for both Turbopack (dev) and Webpack (build).
	turbopack: {
		rules: {
			"*.glsl": {
				loaders: ["raw-loader"],
				as: "*.js",
			},
		},
	},
	webpack: (config: any) => {
		// Treat shader files as source assets so `import shader from './x.glsl'` returns a string.
		config.module.rules.push({
			test: /\.(glsl|vs|fs|vert|frag)$/i,
			type: "asset/source",
		});
		return config;
	},
};

export default nextConfig;
