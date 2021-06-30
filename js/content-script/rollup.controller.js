import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const config = {
    input: "src/controller/index.ts",
    output: {
        format: "esm",
        file: "dist/controller.js"
    },
    plugins: [
        commonjs(),
        typescript(),
        nodeResolve(),
    ],
};

export default config;

