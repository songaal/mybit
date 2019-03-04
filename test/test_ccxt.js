import ccxt from 'ccxt'

(async () => {
    let exchange = new ccxt['bithumb']({
        "apiKey": "7c2ace2277f231489130087e5ee4afd3",
        "secret": "5924e3a2d09c1697535464557ab742fd"
    })
    let response = await ex.privatePostInfoorders()
    console.log(response)
})()
