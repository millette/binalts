'use strict'

const fastify = require("fastify")({ logger: true })

fastify.register(require("fastify-compress"))
fastify.register(require("fastify-leveldb"), {
  name: "tickers-copy-v7",
  options: {
    valueEncoding: "json",
  },
})

fastify.register(require("fastify-static"), {
  root: __dirname,
})

const symbols = [
  "FUNBTC",
  "CVCBTC",
  "DASHBTC",
  "DNTBTC",
  "LTCBTC",
  "ADABTC",
  "ETHBTC",
  "XMRBTC",
  "DCRBTC",
  "SALTBTC",
  "REPBTC",
]

fastify.get("/stocks.csv", (request, reply) => {
  reply.type("text/plain")
  const ddd = ["date,symbol,price"]
  fastify.level.createReadStream(request.query)
    .on("data", ({ key, value }) => {
      symbols.forEach((symbol) => {
        const price = value[symbol]
        if (key && price) ddd.push([key, symbol, price].join())
      })
    })
    .on("end", () => {
      reply.send(ddd.join("\n"))
    })
})

fastify.get("/favicon.ico", (request, reply) => reply.code(404).send("not found"))
fastify.get("/", (request, reply) => reply.sendFile("index.html"))

// Run the server!
fastify.listen(3000, function(err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})
