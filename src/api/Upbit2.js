import ccxt from 'ccxt'
import { config } from '~/Config'
import Base2 from '@api/Base2'

class Upbit2 extends Base2 {
    constructor() {
        super()
        this.id = config.exchanges.upbit.id
    }
    getBaseList() {
        return Object.keys(this.exchanges[this.id])
    }
    getCoinList(base) {
        return this.exchanges[this.id][base]
    }
}


export default new Upbit2()