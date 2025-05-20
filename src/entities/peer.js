
export class Peer {
  constructor(peer) {
    this.peer = peer;
    this.id = peer.id;
    this.multiaddr = peer.multiaddrs[0];
    console.log('🔍 Peer discovered', this.id.toString());
  }

  getPeerId() {
    return this.id.toString();
  }

  async dialChat(node) {
    const stream = await node.dialProtocol(this.multiaddr, '/chat/1.0.0');
    return stream;
  }

  async sendMessage(message, node) {
    try {
      const stream = await this.dialChat(node);
      const encoder = new TextEncoder();
      await stream.sink([encoder.encode(message)]);
      console.log('📤 Message sent to peer:', this.id.toString().slice(-6));
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }
}
