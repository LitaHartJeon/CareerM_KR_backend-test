### Build
docker build -t binance-price .


### Run
docker run -p 3000:3000 binance-price


### HTTP API
GET /api/prices


#### Query:
symbols=BTCUSDT,ETHUSDT
n=5
