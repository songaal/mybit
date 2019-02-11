
let state = {
  key: {
    key1: {},
    key2: {
      key1: {},
      key2: {},
      key3: {}
    }
  }
}
let change = {
  key: 'key1',
  key1: {key2: {
    key3: {
      key4: {
        key5: 'hi~!'
      }
    }
  }}
}

state = Object.assign(state.key, {[change.key]: change.key1})
console.log(JSON.stringify(state))
