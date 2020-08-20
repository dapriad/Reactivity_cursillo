console.log('---- Version 1.2 ----')
console.log(
  'Creating depsMap where we store the dependency object for each property...',
)

/**
 *  LIBRARY REACTIVE
 */

const depsMap = new Map()
console.log('depsMap', depsMap)

function track(key) {
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }

  dep.add(effect)
}

function trigger(key) {
  let dep = depsMap.get(key)
  if (dep) {
    dep.forEach(effect => {
      effect()
    })
  }
}

/**
 * CODE TO EXECUTE
 */

let product = { price: 5, quantity: 2 }
console.log('product', product)
let total = 0
console.log('total', total)

let effect = () => {
  total = product.price * product.quantity
}
track('quantity')
effect()
