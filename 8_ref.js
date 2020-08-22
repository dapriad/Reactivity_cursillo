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

// This will work but its not the best practice and how is done it in vue3
// function ref(intialValue) {
//   return reactive({ value: initialValue })
// }

function ref(raw) {
  const r = {
    get value() {
      track(r, 'value')
      return raw
    },
    set value(newVal) {
      raw = newVal
      trigger(r, 'value')
    },
  }
  return r
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
let salePrice = ref(0)
let total = 0

effect(() => {
  salePrice.value = product.price * 0.9
})

effect(() => {
  total = salePrice.value * product.quantity
})

console.log(
  `Before updated quantity total (should be 9) = ${total} salePrice (should be 4.5) = ${salePrice.value}`
)
product.quantity = 3
console.log(
  `After updated quantity total (should be 13.5) = ${total} salePrice (should be 4.5) = ${salePrice.value}`
)
product.price = 10
console.log(
  `After updated price total (should be 27) = ${total} salePrice (should be 9) = ${salePrice.value}`
)
