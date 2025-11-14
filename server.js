import http from "http";
import { readFile } from "fs";
import { extname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const port = 3000;

const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  let filePath = join(__dirname, req.url === "/" ? "index.html" : req.url);
  const ext = extname(filePath);
  const contentType = mimeTypes[ext] || "text/plain";

  readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("Arquivo não encontrado!");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

server.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
