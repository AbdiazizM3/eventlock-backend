const app = require("./app");
const http = require("http");

const { PORT = 9090 } = process.env;
const server = http.createServer(app);

server.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
