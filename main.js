'use strict'

const $waiting = document.getElementById("waiting")

$waiting.innerText = "Chargement en cours..."
const ii = setInterval(() => { $waiting.innerText = $waiting.innerText + "." }, 333)

const it = (result) => {
  clearInterval(ii)
  $waiting.innerText = ""
	// Access the Vega view instance
	// https://vega.github.io/vega/docs/api/view/ as result.view
}

vegaEmbed('#vis', "specs-lite.json", { width: 1700, height: 900 })
  .then(it)
  .catch(console.error)
