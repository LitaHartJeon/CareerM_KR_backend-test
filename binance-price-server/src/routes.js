// HTTP + SSE API
// src/routes.js

const express = require("express");

/*
  API Router

  - HTTP 조회 API
  - SSE 실시간 스트림
*/

module.exports = function createRoutes(store) {
  const router = express.Router();

  /*
    HTTP API
    GET /api/prices?symbols=BTCUSDT,ETHUSDT&n=5
  */
  router.get("/prices", (req, res) => {
    try {
      const symbols = req.query.symbols?.split(",");
      const n = Number(req.query.n);

      if (!symbols || !n) {
        return res.status(400).json({ error: "invalid request" });
      }

      const data = store.getLatest(symbols, n);
      res.json(data);

    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

  /*
    SSE API
    GET /api/stream?symbols=BTCUSDT,ETHUSDT
  */
  router.get("/stream", (req, res) => {
    const symbols = req.query.symbols?.split(",");

    try {
      store.validate(symbols);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    // SSE 헤더
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    // 업데이트 발생 시 전송
    const unsubscribe = store.subscribe(price => {
      if (!symbols.includes(price.symbol)) return;

      res.write(`data:${JSON.stringify(price)}\n\n`);
    });

    // 클라이언트 종료 시 리스너 제거 (메모리 누수 방지)
    req.on("close", unsubscribe);
  });

  return router;
};