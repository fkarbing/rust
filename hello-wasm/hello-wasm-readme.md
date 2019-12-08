# Compiling from Rust to WebAssembly

https://developer.mozilla.org/en-US/docs/WebAssembly/Rust_to_wasm


## Rust Environment Setup

### Install Rust

Install Rust by going to the [Rust Install](https://www.rust-lang.org/install.html)

Rustup installs: 
	* rustc, the Rust compiler
	* cargo, Rust's package manager 
	* rust-std, Rust's standard libraries
	* rust-docs, some helpful docs

To build the package, we need an additional tool, wasm-pack
$ cargo install wasm*pack


## Install Node.js and get an npm account

	* Sign up at npm
	* $ npm adduser

$ cargo new --lib hello-wasm

in hello-wasm/src/lib.rs:

extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}


## Compiling our code to WebAssembly

$ vi ./hello-wasm/Cargo.toml

[package]
name = "hello-wasm"
version = "0.1.0"
authors = ["Your Name <you@example.com>"]
description = "A sample project with wasm-pack"
license = "MIT/Apache-2.0"
repository = "https://github.com/yourgithubusername/hello-wasm"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"


## Building the package

$ cd hello-wasm/
$ wasm-pack build --scope karb4ever 

Does a lot (first time takes time..) 
In short, wasm-pack build:

1. Compiles your Rust code to WebAssembly.
2. Runs wasm-bindgen on that WebAssembly, generating a JavaScript file that wraps up that WebAssembly file into a module npm can understand.
3. Creates a pkg directory and move that JavaScript file and your WebAssembly code into it.
4. Reads your Cargo.toml and produces an equivalent package.json.
Copies your README.md (if you have one) into the package.


### Outout

   Compiling hello-wasm v0.1.0 (/Users/karbing/dev/rust/hello-wasm)
    Finished release [optimized] target(s) in 56.35s
⚠️   [WARN]: origin crate has no README
[INFO]: License key is set in Cargo.toml but no LICENSE file(s) were found; Please add the LICENSE file(s) to your project directory
[INFO]: ⬇️  Installing wasm-bindgen...
[INFO]: ✨   Done in 1m 03s
[INFO]: 📦   Your wasm pkg is ready to publish at ./pkg.


## Publishing our package to npm

$ cd pkg
$ npm publish --access=public


## Using the package on the web

$ cd ../..
$ mkdir site
$ cd site

### Create a new file, package.json

Note that you need to fill in your own username,

{
  "scripts": {
    "serve": "webpack-dev-server"
  },
  "dependencies": {
    "@mynpmusername/hello-wasm": "^0.1.0"
  },
  "devDependencies": {
    "webpack": "^4.25.1",
    "webpack-cli": "^3.1.2",
    "webpack-dev-server": "^3.1.10"
  }
}


###  configure Webpack. Create webpack.config.js

const path = require('path');
module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  mode: "development"
};

### we need an HTML file; create index.html

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>hello-wasm example</title>
  </head>
  <body>
    <script src="./index.js"></script>
  </body>
</html>

### Finally, create the index.js

Note that you need to fill in your npm username again.

const js = import("./node_modules/@yournpmusername/hello-wasm/hello_wasm.js");
js.then(js => {
  js.greet("WebAssembly");
});

### We're done making files. Let's give this a shot:

$ npm install
$ npm run serve

http://localhost:8080 
