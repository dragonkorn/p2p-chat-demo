# 🕸️ P2P Chat Demo using libp2p

This is a simple peer-to-peer (P2P) network demo using [libp2p](https://libp2p.io/), the modular networking stack used in IPFS. It demonstrates how to create two or more peers that can connect and communicate without a central server.

---

## 📦 Technologies Used

- **libp2p**: Core peer-to-peer networking framework
- **@libp2p/tcp**: TCP transport layer
- **@libp2p/mplex**: Stream multiplexer
- **@libp2p/noise**: Secure communication via Noise protocol

---

## 🚀 Getting Started

### 1. Install Node.js

Download and install from:  
https://nodejs.org/

---

### 2. Clone the project

```bash
git clone https://github.com/your-username/p2p-chat-demo.git
cd p2p-chat-demo
```

### 3. Install dependencies

```bash
yarn install
```

### 4. Run a peer

In one terminal:

```bash
yarn run peer.js
```

In another terminal:

```bash
yarn run peer.js
```

Each peer will start with a unique peer ID and can be extended to send messages or discover other peers.

## 🧱 Project Structure

| File         | Description                                                       |
| ------------ | ----------------------------------------------------------------- |
| peer.js      | Creates and starts a basic libp2p peer with TCP, mplex, and noise |
| package.json | Project metadata and dependencies                                 |

## 💡 Learn More

- libp2p documentation
- libp2p examples
- Noise protocol
- Multiplexing (mplex)
