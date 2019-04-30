const net = require('net')
const rl = require('./readline')


const HOST = process.argv[2] || 'localhost'
const PORT = process.argv[3] || 8860

const HANDSHAKE = '42'
const HANDSHAKE_RESPONSE = 'ok'

console.log('this program gets the square of an integer from a tcp server.')
console.log('for custom host and port run the program with following arguments: node client <host> <port>')

const client = net.createConnection({ host: HOST, port:PORT }, ()=>{
  client.write(HANDSHAKE)
  client.on('data', acceptResponse)
  function acceptResponse(res) {
    if(res.toString() === HANDSHAKE_RESPONSE) {
      client.removeListener('data', acceptResponse)
      client.on('data', handleData)
      console.log('connected to server')
      rl.connection = client
      rl.prompt()
    } else {
      console.log('bad handshake response from server')
      process.exit(1)
    }
  }

})

function handleData(data) {
  let result
  switch (data.byteLength) {
    case 1:
      result = data.readUInt8()
      break
    case 2:
      result = data.readUInt16BE()
      break
    case 4:
      result = data.readUInt32BE()
      break
    default:
      result = data.readDoubleBE()
  }
  console.log('received response: ' + result)
  rl.prompt()
}


client.on('end', ()=>{
  console.log('connection has been terminated')
  process.exit(1)
})


client.on('error', err => {
  if(err.message === 'read ECONNRESET') {
    console.log('\nlost connection with server')
    process.exit(1)
  } else if (err.message.includes('ECONNREFUSED')) {
    console.log('\ncouldnt connect to server')
    process.exit(1)
  } else throw(err)
})