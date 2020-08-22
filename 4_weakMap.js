console.log('---- Version 1.3 ----')
console.log(
  'Creating targetMap which is a weakMap(js) where we store the dependencies associated with each reactive object`s properties...',
)
console.log('Muggle')
console.log('targetMap => depsMap => dep')
console.log('Js freaks')
console.log('WeakMap() => Map() => Set()')

/**
 *  LIBRARY REACTIVE
 */

// For storing the dependencies for each reactive object
const targetMap = new WeakMap()

function track(target, key) {
  // Get the current depsMap for this target (reactive object)
  let depsMap = targetMap.get(target)

  if (!depsMap) {
    // if it doesn't exist, create it
    targetMap.set(target, (depsMap = new Map()))
  }
  // Get the depndency object for this property
  let dep = depsMap.get(key)
  // If it doesn't exist, create it
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  // Add the effect to the dependency
  dep.add(effect)
}

function trigger(target, key) {
  const depsMap = targetMap.get(target)
  // Does this object have any properties that have dependencies?
  if (!depsMap) {
    console.log(target + 'No fue registrado en el mapa')
    // If no, return from the function immediately
    return
  }
  // Otherwise, check if this property has a dependency
  let dep = depsMap.get(key)
  if (dep) {
    // Run those
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
track(product, 'quantity')
effect()

console.log('total with effect applied', total)
