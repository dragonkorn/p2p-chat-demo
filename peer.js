import process from 'node:process'
import { createLibp2p } from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { multiaddr } from 'multiaddr'
import { ping } from '@libp2p/ping'
import { mdns } from '@libp2p/mdns'
import { pipe } from 'it-pipe'


const node = await createLibp2p({
  addresses: {
    // add a listen address (localhost) to accept TCP connections on a random port
    listen: ['/ip4/127.0.0.1/tcp/0']
  },
  transports: [tcp()],
  connectionEncrypters: [noise()],
  streamMuxers: [yamux()],
  services: {
    ping: ping({
      protocolPrefix: 'ipfs', // default
    }),
    discovery: mdns(),
  },
})

// Handle incoming /chat/1.0.0 messages
node.handle('/chat/1.0.0', async ({ stream }) => {
  await pipe(
    stream.source,
    async function (source) {
      const decoder = new TextDecoder()
      for await (const msg of source) {
        const message = decoder.decode(msg.subarray())
        // console.log('📩 Received message:', decoder.decode(msg))
        console.log('📩 Received message:', (message))
      }
    }
  )
})

// Start node
await node.start()
console.log('✅ libp2p started with ID:', node.peerId.toString())

// Show listening addresses
node.getMultiaddrs().forEach((addr) => {
  console.log('📡 Listening on:', addr.toString())
})

// node.addEventListener('peer:discovery', async (evt) => {
//   node.dial(evt.detail.multiaddrs) // dial discovered peers
//   console.log('found peer: ', evt.detail.toString())
//   // ping to found peer
//   const latency = await node.services.ping.ping(evt.detail.multiaddrs)
//   console.log(`pinged ${evt.detail.multiaddrs} in ${latency}ms`)
// })

// Log discovered peers via mDNS
node.addEventListener('peer:discovery', async (evt) => {
  const peer = evt.detail
  console.log('🔍 Discovered peer:', peer.id.toString())
  const ma = peer.multiaddrs[0]
  console.log('🔍 Dialing peer at:', ma.toString())
  const stream = await node.dialProtocol(ma, '/chat/1.0.0')
  const encoder = new TextEncoder()
  const message = 'Hello from me!'
  await stream.sink([encoder.encode(message)])
  console.log('📤 Message sent!')
})

// If peer multiaddr is provided in CLI, send message
if (process.argv.length >= 3) {
  const ma = multiaddr(process.argv[2])
  console.log(`💬 Dialing peer at: ${process.argv[2]}`)
  const stream = await node.dialProtocol(ma, '/chat/1.0.0')

  const encoder = new TextEncoder()
  const message = 'Hello from me!'
  await stream.sink([encoder.encode(message)])
  console.log('📤 Message sent!')
} else {
  console.log('💡 To send a message, run: node peer.js <multiaddr>')
}

// Clean shutdown on Ctrl+C
const stop = async () => {
  await node.stop()
  console.log('\n🛑 libp2p stopped')
  process.exit(0)
}
process.on('SIGTERM', stop)
process.on('SIGINT', stop)