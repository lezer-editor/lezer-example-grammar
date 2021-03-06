import nodeResolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';

export default [

  {
    input: "./src/grammar/parser.js",
    output: [{
      format: "cjs",
      file: "./dist/grammar/parser.cjs"
    }, {
      format: "es",
      file: "./dist/grammar/parser.es.js"
    }],
    external(id) {
      return !/^[\.\/]/.test(id)
    },
    plugins: [
      nodeResolve(),
      copy({
        targets: [
          { src: './src/grammar/parser.d.ts', dest: './dist/grammar/' }
        ]
      })
    ]
  },

  {
    input: ["./src/index.ts"],
    output: [{
      format: "es",
      exports: "auto",
      file: "./dist/index.es.js"
    }],
    plugins: [
      nodeResolve(),
      typescript(),
      commonjs()
    ]
  }]