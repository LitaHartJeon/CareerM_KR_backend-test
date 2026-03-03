// Binance WebSocket
// src/binanceWS.js

const WebSocket = require("ws");
const config = require("./config");

/*
  Binance WebSocket Collector

  역할:
  - Binance 실시간 시세 수집
  - 연결 끊어지면 자동 재연결
*/

function startBinanceWS(store) {
  let ws;
  let backoff = 1000;

  function connect() {
    const streams = config.SYMBOLS
      .map(s => `${s}@bookTicker`)
      .join("/");

    const url =
      `wss://stream.binance.com:9443/stream?streams=${streams}`;

    ws = new WebSocket(url);

    ws.on("open", () => {
      console.log("WS connected");
      backoff = 1000;
    });

    ws.on("message", raw => {
      const msg = JSON.parse(raw).data;

      store.push({
        symbol: msg.s,
        bid: msg.b,
        ask: msg.a,
        bidQty: msg.B,
        askQty: msg.A,
        time: Date.now(),
      });
    });

    ws.on("close", reconnect);

    ws.on("error", () => ws.close());
  }

  // exponential backoff 재연결
  function reconnect() {
    console.log("WS reconnecting...");

    setTimeout(connect, backoff);
    backoff = Math.min(backoff * 2, config.MAX_BACKOFF);
  }

  connect();

  // graceful shutdown 용
  return () => ws?.terminate();
}

module.exports = startBinanceWS;