import { pipe } from 'it-pipe'
import { Peer } from '../entities/peer.js'

let peerConnections = new Map()

export const handleChatProtocol = (node) => {
  node.handle('/chat/1.0.0', async ({ stream }) => {
    await pipe(
      stream.source,
      async function (source) {
        const decoder = new TextDecoder()
        for await (const msg of source) {
          const message = decoder.decode(msg.subarray())
          console.log('📩 Received message:', message)
        }
      }
    )
  })
}

export const setupPeerDiscovery = (node) => {
  node.addEventListener('peer:discovery', async (evt) => {
    const peer = evt.detail
    if (peerConnections.has(peer.id.toString())) {
      return
    }

    const peerConnection = new Peer(peer)
    peerConnections.set(peer.id.toString(), peerConnection)

    peerConnection.sendMessage('Hello from ' + node.peerId.toString(), node)
  })
}

export const sendMessage = async (stream, message) => {
  const encoder = new TextEncoder()
  await stream.sink([encoder.encode(message)])
  console.log('📤 Message sent!')
  return true
}