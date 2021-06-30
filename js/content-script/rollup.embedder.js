import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const config = {
    input: "src/embedder/index.ts",
    output: {
        file: "dist/embedder.js",
        format: "esm"
    },
    plugins: [
        commonjs(),
        typescript(),
        nodeResolve(),
    ],
};

export default config;

