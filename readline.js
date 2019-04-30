const readline = require('readline')

const MAX_NUM = 4294967295

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.setPrompt('Please provide an integer: ')

rl.on('line', (input) => {
  input = input.trim()
  if (input === 'exit') {
    rl.close()
    process.exit(1)
  } else {
    return rl.handleInput(input)
  }
})

rl.handleInput = function (input) {
  if(!input || isNaN(input)) {
    console.log('\nThat doesn\'t look like a number')
    return rl.prompt()
  } else {
    let num = Number(input)
    
    if (!Number.isInteger(num)) {
      num = parseInt(num)
      console.log('received float, parsing integer: ' + num)
    }

    if (Math.abs(num) > MAX_NUM) {
      console.log(`\nno integers less than -${MAX_NUM} or greater than ${MAX_NUM}. sorry.`)
      return rl.prompt()
    } else {
      const buffer = rl.numToBinary(Math.abs(num))
      if (rl.connection) {
        return rl.connection.write(buffer)
      } else {
        console.log('no connection discovered, aborting')
        process.exit(1)
      }

    }

  }
}

rl.numToBinary = function (num) {
  const binary = num.toString(2)
  const bytes = Math.ceil(binary.length/8)
  let buffer
  switch (bytes) {
    case 1:
      buffer = Buffer.alloc(1)
      buffer.writeUInt8(num)
      break
    case 2:
      buffer = Buffer.alloc(2)
      buffer.writeUInt16BE(num)
      break
    case 3:
    case 4:
      buffer = Buffer.alloc(4)
      buffer.writeUInt32BE(num)
      break
  }
  return buffer
}

module.exports = rl