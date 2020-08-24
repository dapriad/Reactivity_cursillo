console.log('---- Version 1.4 ----')
console.log('Adding Proxy and Reflect properties from ES6 to library')

console.log(
  'Proxy is a Placeholder for another object, which by default delegates to the object',
)

console.log(
  'Proxied products has a second argument which is a handler, ' +
    'in the handler we can set a `trap` which allows us to intercept fundamental operations',
)
/**
 *  LIBRARY REACTIVE
 */

//Encapsulate code in a function
function reactive(target) {
  const handler = {
    // receiver => ensures the proper value of this is used when our object has
    // inherited values or functions from another object
    get(target, key, receiver) {
      console.log('Get was called with key = ' + key)
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      console.log('Set was called with key = ' + key + ' and value = ' + value)
      return Reflect.set(target, key, value, receiver)
    },
  }
  return new Proxy(target, handler)
}
/**
 * CODE TO EXECUTE
 */

let product = reactive({ price: 5, quantity: 2 })

product.quantity = 4

console.log('product.quantity', product.quantity)
