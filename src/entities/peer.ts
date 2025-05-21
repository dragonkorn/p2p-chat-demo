import { Libp2p, PeerId, PeerInfo, Stream } from '@libp2p/interface';
import type { Multiaddr } from '@multiformats/multiaddr'

export class Peer {
  public peer: PeerInfo;
  public id: PeerId;
  public multiaddr: Multiaddr | null;
  public stream: Stream | null;
  public isConnected: boolean = false;


  constructor(peer: PeerInfo) {
    console.log('🔍 [Peer:constructor]', peer.id, peer.multiaddrs);

    this.peer = peer;
    this.id = peer.id;
    if (peer.multiaddrs?.length > 0) {
      this.multiaddr = peer.multiaddrs[0];
    } else {
      this.multiaddr = null;
    }
    this.stream = null;
    console.log('🔍 Peer discovered', peer.id.toString());
  }

  getPeerId() {
    return this.id.toString();
  }

  async dialChat(node: Libp2p): Promise<boolean> {
    if (this.multiaddr) {
      try {
        const stream = await node.dialProtocol(this.multiaddr, '/chat/1.0.0');
        this.stream = stream;
        this.isConnected = true;
        return true;
      } catch (error) {
        console.error('Error dialing chat:', error);
        return false;
      }
    }
    return false;
  }

  async sendMessage(message: string) {
    try {
      if (!this.stream) {
        console.error('No stream to send message');
        return false;
      }
      const encoder = new TextEncoder();
      this.stream.sink([encoder.encode(message)]);
      console.log('📤 Message sent to peer:', this.id.toString().slice(-6));
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }
}
