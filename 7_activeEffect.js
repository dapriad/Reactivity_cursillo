console.log('---- Version 1.6 ----')
console.log('Active Effect')

/**
 *  LIBRARY REACTIVE
 */

// For storing the dependencies for each reactive object
const targetMap = new WeakMap()
// The active effect running
let activeEffect = null

function track(target, key) {
  if (activeEffect) {
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
    dep.add(activeEffect)
  }
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
    dep.forEach((effect) => {
      effect()
    })
  }
}

// Reactive function which handlers track and trigger functionallity
function reactive(target) {
  const handler = {
    // receiver => ensures the proper value of this is used when our object has
    // inherited values or functions from another object
    get(target, key, receiver) {
      let result = Reflect.get(target, key, receiver)
      track(target, key)
      return result
    },
    set(target, key, value, receiver) {
      let oldValue = target[key]
      let result = Reflect.set(target, key, value, receiver)
      if (result && oldValue != value) {
        trigger(target, key)
      }
      return result
    },
  }
  return new Proxy(target, handler)
}

function effect(eff) {
  activeEffect = eff
  activeEffect()
  activeEffect = null
}
/**
 * CODE TO EXECUTE
 */

let product = reactive({ price: 5, quantity: 2 })
let salePrice = 0
let total = 0
effect(() => {
  total = product.price * product.quantity
})
effect(() => {
  salePrice = product.price * 0.9
})
console.log(
  `Before updated quantity total (should be 10) = ${total} salePrice (should be 4.5) = ${salePrice}`
)
product.quantity = 3
console.log(
  `After updated quantity total (should be 15) = ${total} salePrice (should be 4.5) = ${salePrice}`
)
product.price = 10
console.log(
  `After updated price total (should be 30) = ${total} salePrice (should be 9) = ${salePrice}`
)
