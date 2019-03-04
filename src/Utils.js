class Utils {
  lpad(s, l, c) {
    let diff = l - String(s).length
    if (diff > 0) {
      for (let i =0; i < diff; i++) {
        s = c + s
      }
    }
    return s
  }
  formatTimestamp(timestamp) {
    let date = new Date(timestamp)
    let sDate = ''
    sDate = date.getFullYear()
    sDate += '.' + this.lpad(date.getMonth(), 2, '0')
    sDate += '.' + this.lpad(date.getDate(), 2, '0')
    sDate += ' ' + this.lpad(date.getHours(), 2, '0')
    sDate += ':' + this.lpad(date.getMinutes(), 2, '0')
    sDate += ':' + this.lpad(date.getSeconds(), 2, '0')
    return sDate
  }
}

export default new Utils()