'use strict'

const $waiting = document.getElementById("waiting")

$waiting.innerText = "Chargement en cours..."
const ii = setInterval(() => { $waiting.innerText = $waiting.innerText + "." }, 333)

const fetchPeriod = async (view, from, to) => {
  const r = await fetch(`/stocks.csv?gte=${new Date(from).toISOString()}&lt=${new Date(to).toISOString()}`)
  const text = await r.text()

  const [h, ...dd] = text.split("\n")
  const keys = h.split(",")
  const roro = dd.map((x) => {
    const y = x.split(",")
    const o = {}
    keys.forEach((k, i) => { o[k] = y[i] })
    // j'ajoute du bruit pour mieux illustrer les changements
    // o.price = parseFloat(o.price) + Math.random() / 3000
    return o
  })
  console.log("roro.length", roro.length)
  if (roro.length < 100) return "STOP"
  return view.data("tickers", roro).runAsync()
}

const it = async ({ view }) => {
  const period = 6 * 3600000
  $waiting.innerText = "Chargement du data..."

  const from = 1583186000000 // Date.now() - (86400000/1.5)
  await fetchPeriod(view, from, from + period)
  clearInterval(ii)
  $waiting.innerText = ""

  const step = 3600000

  const stepper = async (f) => {
    const stop = await fetchPeriod(view, f, f + period)
    if (stop !== "STOP") setTimeout(stepper, 33, f + step)
  }

  return stepper(from + step)
}

vegaEmbed('#vis', "specs-lite.json", { width: 1700, height: 900 })
  .then(it)
  .catch(console.error)
