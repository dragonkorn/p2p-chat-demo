import { pipe } from 'it-pipe'
import { Peer } from '../entities/peer.js'
import Readline from 'readline';
import { Libp2p } from 'libp2p';
import { PeerInfo, Stream, Connection } from '@libp2p/interface';
import { getHelpMessage } from '../utils/utils.js';

let peerConnections = new Map<string, Peer>()
let discoveredPeers = new Map<string, Peer>()

export const handleChatProtocol = (node: Libp2p) => {
  node.handle('/chat/1.0.0', async ({ stream, connection }: { stream: Stream, connection: Connection }) => {
    const remotePeerId = connection.remotePeer.toString()
    await pipe(
      stream.source,
      async function (source: any) {
        const decoder = new TextDecoder()
        for await (const msg of source) {
          const message = decoder.decode(msg.subarray())
          console.log(`📩 ${remotePeerId.slice(-6)}:`, message)
        }
      }
    )
  })
}

export const setupPeerDiscovery = (node: Libp2p) => {
  node.addEventListener('peer:discovery', async (evt: CustomEvent<PeerInfo>) => {
    const peer = evt.detail
    const newPeer = new Peer(peer)
    if (discoveredPeers.has(peer.id.toString())) {
      if (newPeer.multiaddr?.toString() == discoveredPeers.get(peer.id.toString())?.multiaddr?.toString()) {
        return
      }
    }

    discoveredPeers.set(peer.id.toString(), newPeer)

    const isConnected = await newPeer.dialChat(node)
    if (!isConnected) {
      return
    }

    peerConnections.set(peer.id.toString(), newPeer)
  })

  node.addEventListener('connection:open', (evt: any) => {
    const remotePeerId = evt.detail.remotePeer.toString()
    console.log(`🔗 Peer connected: ${remotePeerId}`)
    if (peerConnections.has(remotePeerId)) {
      return
    }

    const newPeer = discoveredPeers.get(remotePeerId)
    if (!newPeer) {
      return
    }

    peerConnections.set(remotePeerId, newPeer)
  })

  node.addEventListener('connection:close', (evt: any) => {
    const remotePeerId = evt.detail.remotePeer.toString()
    console.log(`❌ Peer disconnected: ${remotePeerId}`)
    peerConnections.delete(remotePeerId)
  })
}

export function setupInteractiveCLI(node: Libp2p) {
  const rl = Readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n', getHelpMessage(), '\n');

  rl.on('line', async (input) => {
    const [command, ...args] = input.trim().split(' ');

    switch (command) {
      case '':
        break
      case 'help':
        console.log('\n', getHelpMessage(), '\n');
        break;
      case '\n':
      case '\r':
        break
      case 'list':
        console.log('\nConnected peers:');
        for (const peerId of peerConnections.keys()) {
          const peer = peerConnections.get(peerId);
          if (peer) {
            console.log(`- ${peer.getPeerId()}`);
          }
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
        if (peer) {
          await peer.sendMessage(message);
        } else {
          console.log('Peer not found');
        }
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