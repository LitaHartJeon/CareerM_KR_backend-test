###Build
docker build -t binance-price .


###Run
docker run -p 3000:3000 binance-price


###HTTP API
GET /api/prices


####Query:
symbols=BTCUSDT,ETHUSDT
n=5

# mofin-2026-1q-backend-test
모핀 2026년 1분기 백엔드 개발자 어플리케이션 구현 능력 테스트

[TEST.md](./TEST.md) 참조