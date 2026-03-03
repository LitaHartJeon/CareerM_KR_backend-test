// 서버 시작
// src/server.js

const express = require("express");
const config = require("./config");
const PriceStore = require("./priceStore");
const startBinanceWS = require("./binanceWS");
const createRoutes = require("./routes");

// 시세 저장소 생성
const store = new PriceStore(config.SYMBOLS);

// Binance WS 시작
const stopWS = startBinanceWS(store);

const app = express();

app.use("/api", createRoutes(store));

const server = app.listen(config.PORT, () => {
  console.log(`Server started on ${config.PORT}`);
});

// Graceful shutdown (클라우드 필수)
function shutdown() {
  console.log("Shutting down...");
  stopWS();
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);