export default utils = {
  formatPrice: (price, length) => {
    return price
  },
  getExchangeList: (store) => {
    return Object.keys(store.exchanges)
  },
  getBaseList: (store, exchange) => {
    return Object.keys(store.exchanges[exchange])
  },
  getCoinList: (store, exchange, base) => {
    return Object.keys(store.exchanges[exchange][base])
  }
}
