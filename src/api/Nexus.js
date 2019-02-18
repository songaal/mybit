/*
 * 거래소 웹소켓또는 폴링작업을 임포트하는 영역.
 * 싱글턴방식으로 중복 실행안되게 구현체에서 정의
 * class Base 상속받아서 구현제 만들기.
 * 구현체에서는 파라미터, 메시지 데이터만 변환작업만 진행
 */
import Upbit from '@api/Upbit'
import Bithumb from '@api/Bithumb'
import Bitmex from '@api/Bitmex'

class Nexus {
    constructor() {
        this.api = {
            'upbit': Upbit,
            'bithumb': Bithumb,
            'bitmex': Bitmex
        }
    }
    checkMarket(callback) {
        let isReady = true
        Object.keys(this.api)
        .forEach(key => {
            if (!this.api[key].isMarketReady) {
                isReady = false
                return false
            }
        })
        if (isReady === true) {
            callback(isReady)
        } else {
            setTimeout(() => {
                this.checkMarket(callback)
            }, 500)
        }
    }
    isSubscribe(exchange, type) {
        return this.api[exchange].ws[type] !== undefined ||
        this.api[exchange].rest[type] !== undefined 
    }
    close(exchange, type) {
        this.api[exchange].close(type)
    }
    closeAll(exchange) {
        if (exchange === undefined) {
            Object.keys(this.api).forEach(key => {
                this.api[key].closeAll()
            })
        } else {
            this.api[exchange].closeAll()
        }
    }
    getMarketKeyMap(exchange) {
        return Object.assign({}, this.api[exchange].marketKeyMap)
    }
    runTicker(exchange, base) {
        this.api[exchange].ticker(base)
    }
    getPriceInfo(exchange, type=null) {
        return this.api[exchange].markets.priceInfo
    }
    runOrderbook(exchange, base, coin) {
        this.api[exchange].orderbook(base, coin)
    }
}
export default new Nexus()