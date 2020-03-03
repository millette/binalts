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
    return o
  })
  return roro
  /*
  console.log("roro.length", roro.length)
  if (roro.length < 100) return "STOP"
  return view.data("tickers", roro).runAsync()
  */
}

const it = async ({ view }) => {
  const period = 8 * 3600000
  $waiting.innerText = "Chargement du data..."

  const from = 1583190000000 // Date.now() - (86400000/1.5)
  const roro = await fetchPeriod(view, from, from + period)
  await view.data("tickers", roro).runAsync()
  clearInterval(ii)
  $waiting.innerText = ""

  const step = 60000

  const stepper = async (f) => {
    const roro2 = await fetchPeriod(view, f, f + step)
    console.log("roro.length", roro2.length)
    if (!roro2.length) return
    const elD = view.data("tickers").slice(0, roro2.length)
    const chch = vega.changeset()
      .remove(elD)
      .insert(roro2)
    setTimeout(stepper, step / 10, f + step)
    return view.change("tickers", chch).runAsync()
  }

  return stepper(from + period)
}

vegaEmbed('#vis', "specs-lite.json", { width: 1700, height: 900 })
  .then(it)
  .catch(console.error)
