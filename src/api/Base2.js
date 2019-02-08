import { config } from '~/Config'
const ccxt = require('ccxt')

export default class Base {
    constructor() {
        this.exchanges = {}
        Object.values(config.exchanges)
        .map(o => o.id)
        .forEach(id => this._loadMarkets(id))
        console.log('ok Upbit')
    }
    _loadMarkets = async (id) => {
        this.exchanges[id] = {}
        let exchagne = new ccxt[id]()
        Object.values(await exchagne.fetchMarkets())
        .forEach(market => {
            this._importMarket(id, market)
        })
    }
    _importMarket(id, market) {
        let base = market['quote']
        let coin = market['base']
        if (this.exchanges[id][base] === undefined) {
            this.exchanges[id][base] = []
        }
        this.exchanges[id][base].push(coin)
    }
}
