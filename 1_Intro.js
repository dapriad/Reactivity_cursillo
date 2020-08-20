console.log('---- Version 1 ----')
console.log('Starting reactivity...')

let price = 5
let quantity = 2

let total = price * quantity

console.log(`total is ${total}`)

price = 20

console.log(`total is ${total}`)
