class Utils {
  formatHumanReadablePrice(price, currency) {
    if (currency === 'KRW' || currency.startsWith('USD')) {
      return String(Number(price).toFixed(2)).replace(/(.)(?=(\d{3})+$)/g, '$1,')
    } else {
      return price
    }









  }
}

export default new Utils()