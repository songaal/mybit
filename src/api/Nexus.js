/*
 * 거래소 웹소켓또는 폴링작업을 임포트하는 영역.
 * 싱글턴방식으로 중복 실행안되게 구현체에서 정의
 * class Base 상속받아서 구현제 만들기.
 * 구현체에서는 파라미터, 메시지 데이터만 변환작업만 진행
 */
import Upbit from '@api/Upbit'

class Nexus {
    constructor() {
        this.api = {
            'upbit': Upbit
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
    subscribeTicker(exchange, base, callback) {
        this.api[exchange].ticker(base, callback)
    }
    wsClose(exchange, type) {
        this.api[exchange].wsClose(type)
    }
    wsCloseAll(exchange) {
        if (exchange === undefined) {
            Object.keys(this.api).forEach(key => {
                this.api[key].wsCloseAll()
            })
        } else {
            this.api[exchange].wsCloseAll()
        }
    }
    getMarkets(exchange) {
        return this.api[exchange].markets
    }
    getBaseList(exchange) {
        return this.api[exchange].baseList
    }
    getCoinList(exchange, base) {
        console.log(exchange, base)
        return this.api[exchange].coins[base]
    }
}
export default new Nexus()