const { readFile } = require("fs");
const { join } = require("path");
const { createServer, request: httpRequest } = require("http");
const { request: httpsRequest } = require("https");
const { parse: parseUrl } = require("url");

const basePath = join(__dirname, "mocks/");
const baseUrl = (process.env.API_BASE_URL || "https://api.nature.global/").replace(/\/$/, "");

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

  const proxy = () => {
    const url = `${baseUrl}${req.url}`;
    console.log(req.method, req.url, "->", "proxy:", url);

    const parsedUrl = parseUrl(url);
    const options = {
      ...parsedUrl,
      headers: {
        ...req.headers,
        host: parsedUrl.host,
      },
      method: req.method,
      agent: false,
    };
    const reqFunc = options.protocol === "https:" ? httpsRequest : httpRequest;
    req.pipe(
      reqFunc(options, (resp) => {
        resp.pause();
        res.writeHead(200, { ...defaultHeaders, "Content-Type": "application/json" });
        resp.pipe(res);
        resp.resume();
      }),
    );
  };

  if (req.method === "GET") {
    readFile(join(basePath, req.url), (err, data) => {
      if (err) {
        proxy();
      } else {
        console.log(req.method, req.url, "->", "path:", join(basePath, req.url));

        res.writeHead(200, { ...defaultHeaders, "Content-Type": "application/json" });
        res.write(data);
        res.end();
      }
    });
    return;
  }
  proxy();
}).listen(1234);
