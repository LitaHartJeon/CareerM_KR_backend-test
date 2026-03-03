// 시세 저장소
// src/priceStore.js

const EventEmitter = require("events");
const { MAX_HISTORY } = require("./config");

/*
  PriceStore

  1. WebSocket에서 들어오는 시세 저장
  2. HTTP API 조회 제공
  3. SSE 실시간 이벤트 발행
*/

class PriceStore {
  constructor(symbols) {
    // 조회 가능한 종목 목록
    this.validSymbols = new Set(symbols.map(s => s.toUpperCase()));

    // symbol -> price history[]
    this.store = new Map();

    // SSE 구독자에게 이벤트 전달
    this.events = new EventEmitter();
    this.events.setMaxListeners(0);

    symbols.forEach(s => {
      this.store.set(s.toUpperCase(), []);
    });
  }

  // 잘못된 종목 요청 검사
  validate(symbols) {
    for (const s of symbols) {
      if (!this.validSymbols.has(s.toUpperCase())) {
        throw new Error(`Invalid symbol: ${s}`);
      }
    }
  }

  // WebSocket 데이터 저장
  push(price) {
    const symbol = price.symbol;
    const list = this.store.get(symbol);

    // 최신 데이터 앞쪽 저장
    list.unshift(Object.freeze(price));

    // 메모리 보호 (무한 증가 방지)
    if (list.length > MAX_HISTORY) {
      list.length = MAX_HISTORY;
    }

    // SSE 구독자에게 이벤트 전파
    this.events.emit("update", price);
  }

  // HTTP API 조회
  getLatest(symbols, n) {
    if (n > MAX_HISTORY) {
      throw new Error("n exceeds maximum limit");
    }

    this.validate(symbols);

    const result = {};

    // 응답 구조 생성
    for (let i = 0; i < n; i++) {
      result[`price${i + 1}`] = [];
    }

    for (const s of symbols) {
      const history = this.store.get(s.toUpperCase());

      // n개 없는 종목 제외 (요구사항)
      if (history.length < n) continue;

      for (let i = 0; i < n; i++) {
        result[`price${i + 1}`].push(history[i]);
      }
    }

    return result;
  }

  // SSE 구독
  subscribe(handler) {
    this.events.on("update", handler);
    return () => this.events.off("update", handler);
  }
}

module.exports = PriceStore;