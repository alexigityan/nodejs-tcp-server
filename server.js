const net = require('net')


const HOST = process.argv[2] || 'localhost'
const PORT = process.argv[3] || 8860
 
const HANDSHAKE = '42'
const HANDSHAKE_RESPONSE = 'ok'


console.log('this tcp server returns the square of an integer received from a client.')
console.log('for custom host and port run the program with following arguments: node server <host> <port>')

const server = new net.createServer(
  connection => {
    const address = 
      connection.remoteAddress + ':' + connection.remotePort

    console.log('client connected: ' + address)

    connection.on('data', acceptHandshake)

    function acceptHandshake(handshake) {
      if (handshake.toString() === HANDSHAKE) {
        connection.write(HANDSHAKE_RESPONSE)
        connection.removeListener('data', acceptHandshake)
        connection.on('data', handleData)
      } else {
        console.log('bad handshake with client ' + address)
        connection.write('bad handshake\r\n')
        connection.end()
      }
    }

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
      }
      console.log('received ' + result + ' from client: ' + address)
      const squared = Math.pow(result, 2)
      console.log('sending response: ' + squared)
      return connection.write(numToBinary(squared))

    }

    connection.on('end', ()=> {
      console.log('closing connection with client:' + address)
      connection.end()
    })

    connection.on('error', err => {
      if(err.message === 'read ECONNRESET')
        console.log('lost connection with client: ' + address)
      else throw(err)
    })
  }
)

function numToBinary (num) {
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
    default:
      buffer = Buffer.alloc(8)
      buffer.writeDoubleBE(num)
  }

  return buffer
}

server.on('error', e => {
  if (e.code === 'EADDRNOTAVAIL') {
    console.log('wrong HOST argument: address not available')
    process.exit(1)
  }
})

server.listen( 
  { 
    port: PORT,
    host: HOST
  }, 
  () => console.log('server bound', server.address())
)


