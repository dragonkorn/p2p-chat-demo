import { pipe } from 'it-pipe'
import { Peer } from '../entities/peer.js'
import Readline from 'readline';

let peerConnections = new Map()

export const handleChatProtocol = (node) => {
  node.handle('/chat/1.0.0', async ({ stream, connection }) => {
    const remotePeerId = connection.remotePeer.toString()
    await pipe(
      stream.source,
      async function (source) {
        const decoder = new TextDecoder()
        for await (const msg of source) {
          const message = decoder.decode(msg.subarray())
          console.log(`📩 ${remotePeerId.slice(-6)}:`, message)
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
  })

  node.addEventListener('connection:open', (evt) => {
    const remotePeerId = evt.detail.remotePeer.toString()
    console.log(`🔗 Peer connected: ${remotePeerId}`)
  })

  node.addEventListener('connection:close', (evt) => {
    const remotePeerId = evt.detail.remotePeer.toString()
    console.log(`❌ Peer disconnected: ${remotePeerId}`)
  })
}


export function setupInteractiveCLI(node) {
  const rl = Readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n=== P2P Chat CLI ===');
  console.log('Available commands:');
  console.log('1. list - List all discovered peers');
  console.log('2. send <peerId> <message> - Send message to a peer');
  console.log('3. exit - Exit the program\n');

  rl.on('line', async (input) => {
    const [command, ...args] = input.trim().split(' ');

    switch (command) {
      case '':
        break
      case 'help':
        console.log('\n=== P2P Chat CLI ===');
        console.log('Available commands:');
        console.log('1. list - List all discovered peers');
        console.log('2. send <peerId> <message> - Send message to a peer');
        console.log('3. exit - Exit the program\n');
        break;
      case '\n':
      case '\r':
        break
      case 'list':
        console.log('\nDiscovered peers:');
        for (const peerId of peerConnections.keys()) {
          console.log(`- ${peerConnections.get(peerId).getPeerId()}`);
        }
        break;

      case 'send':
        if (args.length < 2) {
          console.log('Usage: send <peerId> <message>');
          break;
        }
        const [targetPeerId, ...messageParts] = args;
        const message = messageParts.join(' ');
        const peer = peerConnections.get(targetPeerId);
        await peer.sendMessage(message, node);
        break;

      case 'exit':
        console.log('Goodbye!');
        process.exit(0);
        break;

      default:
        console.log('Unknown command. Available commands: list, send, exit');
    }
  });
}