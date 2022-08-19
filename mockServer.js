const { readFile } = require("fs");
const { join } = require("path");
const { createServer } = require("http");

const basePath = join(__dirname, "mocks/");

console.log("listen at http://localhost:1234");

createServer((req, res) => {
  const defaultHeaders = {
    "Access-Control-Allow-Origin": req.headers.origin,
  };
  if (req.method === "OPTIONS") {
    res.writeHead(200, { ...defaultHeaders, "Access-Control-Allow-Headers": req.headers["access-control-request-headers"] });
    res.end();
    return;
  }
  if (req.method === "GET") {
    console.log("get:", req.url, "->", "path:", join(basePath, req.url));
    readFile(join(basePath, req.url), (err, data) => {
      if (err) {
        res.writeHead(404, { ...defaultHeaders, "Content-Type": "text/html" });
        res.end("404");
      } else {
        res.writeHead(200, { ...defaultHeaders, "Content-Type": "application/json" });
        res.write(data);
        res.end();
      }
    });
  } else {
    res.writeHead(404, { ...defaultHeaders, "Content-Type": "text/html" });
    res.end("404");
  }
}).listen(1234);
