'use strict'

const $waiting = document.getElementById("waiting")

$waiting.innerText = "Chargement en cours..."
const ii = setInterval(() => { $waiting.innerText = $waiting.innerText + "." }, 333)

const it = async ({ view }) => {
  $waiting.innerText = "Chargement du data..."

  const r = await fetch("/stocks.csv")
  const text = await r.text()

  const [h, ...dd] = text.split("\n")
  const keys = h.split(",")
  const roro = dd.map((x) => {
    const y = x.split(",")
    const o = {}
    keys.forEach((k, i) => {
      o[k] = y[i]
    })
    return o
  })

  clearInterval(ii)
  $waiting.innerText = ""

  // const after = [ ...roro ]
  const half = async (aa) => {
    // const mid = Math.floor(aa.length * 0.6)
    // console.log("mid", aa)
    if (aa > roro.length - 100) return
    // const aa2 = aa.slice(0, mid)
    // console.log(aa2[0])
    // console.log(aa2[aa2.length - 1])
    // await view.remove("tickers", aa2).runAsync()
    // view.insert("tickers", roro.slice(aa, aa + 10)).run()
    await view.data("tickers", roro.slice(aa, aa + 30)).runAsync()
    // await view.insert("tickers", roro.slice(aa, aa + 10)).runAsync()
    // await view.remove("tickers", roro.slice(aa, aa + 10)).runAsync()
    setTimeout(half, 33, aa + 15)
  }
  half(0)

  // 0, 10
  return view.insert("tickers", roro.slice()).runAsync()
}

vegaEmbed('#vis', "specs-lite.json", { width: 1700, height: 900 })
  .then(it)
  .catch(console.error)
