// 환경 설정
// src/config.js

// 서버 및 비즈니스 설정을 한 곳에서 관리
// 운영 환경에서는 ENV 로 변경 가능

module.exports = {
  PORT: process.env.PORT || 3000,

  // 조회 가능한 최대 시세 개수 (n 최대값)
  MAX_HISTORY: 50,

  // WebSocket 재연결 최대 대기시간
  MAX_BACKOFF: 30000,

  // 수집할 종목 10개
  SYMBOLS: [
    "btcusdt",
    "ethusdt",
    "bnbusdt",
    "xrpusdt",
    "adausdt",
    "solusdt",
    "dogeusdt",
    "maticusdt",
    "ltcusdt",
    "dotusdt",
  ],
};