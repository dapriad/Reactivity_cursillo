console.log('---- Version 1.1 ----')
console.log('Adding effect, track and trigger...')

let price = 5
console.log('price', price)
let quantity = 2
console.log('quantity', quantity)
let total = 0
console.log('total', total)

// Store the effects
let dep = new Set()

// Add the effect
let effect = () => {
  total = price * quantity
}

// Add the code to our storage
function track() {
  dep.add(effect)
}

// Re-run all the code in storage
function trigger() {
  dep.forEach(effect => effect())
}

console.log(
  'We run track to add the code & effect to apply the first multiplication',
)
track()
effect()

console.log(`total is ${total}`)

quantity = 5
console.log('Update quantity to => ' + total)
console.log('Run trigger function')

trigger()

console.log(`total is ${total}`)
