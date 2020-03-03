'use strict'

// npm self
const { name, version } = require("./package.json")

// npm
const got = require("got")
const level = require("level")

const u = "https://api.binance.com/api/v1/ticker/price"

const db = level("tickers", { valueEncoding: "json" })

// db.createReadStream().on("data", ({ key, value }) => console.log(key, value))

const doit = async () => {
  const { headers, body } = await got(u, { headers: { "user-agent": `${name} - v${version}` }, responseType: "json" } )

  // FIXME: use actual timestamp as db key (not iso string).
  const date = new Date(headers.date).toISOString()
  // console.log(JSON.stringify({ date, tickers: body }, null, 2))

  const tickers = {}
  body.forEach(({ symbol, price }) => tickers[symbol] = parseFloat(price))
  return db.put(date, tickers)
}


setInterval(() => {
  console.log(new Date(), "Fetching...")
  doit().catch(console.error)
}, 15000)


