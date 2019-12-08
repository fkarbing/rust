const js = import("./node_modules/@karb4ever/hello-wasm/hello_wasm.js");
js.then(js => {
  js.greet("WebAssembly");
});
