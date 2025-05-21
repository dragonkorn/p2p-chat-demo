# 🕸️ P2P Chat Demo using libp2p

This is a simple peer-to-peer (P2P) network demo using [libp2p](https://libp2p.io/), the modular networking stack used in IPFS. It demonstrates how to create two or more peers that can connect and communicate without a central server.

---

## 📦 Technologies Used

- **libp2p**: Core peer-to-peer networking framework
- **@libp2p/tcp**: TCP transport layer
- **@chainsafe/libp2p-yamux**: Stream multiplexer (Yet another Multiplexer)
- **@chainsafe/libp2p-noise**: Secure communication via Noise protocol

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
yarn start
```

In another terminal:

```bash
yarn start
```

### 5. Using the Interactive CLI

After starting the peer service, you can use the following commands in the interactive CLI:

#### List all discovered peers

```bash
list
```

#### Send a message to a specific peer

```bash
send <peerId> <message>
```

Example:

```bash
send eer123 Hello from peer!
```

#### Exit the program

```bash
exit
```

Each peer will start with a unique peer ID and can be extended to send messages or discover other peers.

## 🧱 Project Structure

| File          | Description                                                       |
| ------------- | ----------------------------------------------------------------- |
| index.js      | Creates and starts a basic libp2p peer with TCP, mplex, and noise |
| connection.js | Creates a handler function for discover other peer                |
| package.json  | Project metadata and dependencies                                 |

## 💡 Learn More

- libp2p documentation
- libp2p examples
- Noise protocol
- Multiplexing (mplex)

## Peer Workflow

[![](https://mermaid.ink/img/pako:eNp9kk1PwzAMhv9K5BNIpfSDtV0OSBuIGwixG-olJGaLaJOSuIgx7b-TbnTaoeJmO4_f15azA2kVAgePnz0aifdarJ1oa8NYJxxpqTthiD0jOraYrC5rM9SPxNXt7THgbEWBZI1-67KOmeByopYjtfyPWpxR7f3Tiintpf1C5wfLCcMH7dCzLmR8RLeTaoNNrLRoLi4Z2TO15ZnaQkrsyDNpjUFJ2h62fLKEbFD-U43YKHp34hh6Em-N9htUk_6D9bOzZKVtLmq4lhtB12mcxEkNl5PDvKDvrFF-GNeTQ9FCBC26VmgVjrcbmmqgDbZYAw-hEu6jhtrsAyd6squtkcDJ9RhB3ylB46HHIipN1j0eP8PhT0QQbvxq7QkJKfAdfAPPi1lcVWlWlmU2T_Iqi2ALfJbE1bxIyzyvbvJ0Vt7sI_g59IeHvKiKLCuKpMiLeRIanO3XG-DvovFBe-2GRY4-Do1Cd2d7Q8DTstr_AsmV16Q?type=png)](https://mermaid.live/edit#pako:eNp9kk1PwzAMhv9K5BNIpfSDtV0OSBuIGwixG-olJGaLaJOSuIgx7b-TbnTaoeJmO4_f15azA2kVAgePnz0aifdarJ1oa8NYJxxpqTthiD0jOraYrC5rM9SPxNXt7THgbEWBZI1-67KOmeByopYjtfyPWpxR7f3Tiintpf1C5wfLCcMH7dCzLmR8RLeTaoNNrLRoLi4Z2TO15ZnaQkrsyDNpjUFJ2h62fLKEbFD-U43YKHp34hh6Em-N9htUk_6D9bOzZKVtLmq4lhtB12mcxEkNl5PDvKDvrFF-GNeTQ9FCBC26VmgVjrcbmmqgDbZYAw-hEu6jhtrsAyd6squtkcDJ9RhB3ylB46HHIipN1j0eP8PhT0QQbvxq7QkJKfAdfAPPi1lcVWlWlmU2T_Iqi2ALfJbE1bxIyzyvbvJ0Vt7sI_g59IeHvKiKLCuKpMiLeRIanO3XG-DvovFBe-2GRY4-Do1Cd2d7Q8DTstr_AsmV16Q)

### Don't auto-connect to all peer you discovered.

- Check discovered peer is trusted or known.
  - Make Peer ID Persistent and list in knowPeers
  - Use an External Identifier (DID, username, etc.)
- Connect to close peer (Using PING)
