import process from 'node:process'
import { createLibp2p } from 'libp2p'
import { multiaddr } from 'multiaddr'
import { createLibp2pConfig } from './config/libp2p.js'
import { handleChatProtocol, setupPeerDiscovery, setupInteractiveCLI } from './services/connection.js'

async function main() {
  // สร้าง node
  const node = await createLibp2p(createLibp2pConfig())

  // ตั้งค่าการจัดการข้อความ
  handleChatProtocol(node)

  // เริ่ม node
  await node.start()
  console.log('✅ libp2p started with ID:', node.peerId.toString())

  // แสดงที่อยู่ที่กำลังฟัง
  node.getMultiaddrs().forEach((addr) => {
    console.log('📡 Listening on:', addr.toString())
  })

  // ตั้งค่าการค้นหา peer
  setupPeerDiscovery(node)

  // ตั้งค่า interactive CLI
  setupInteractiveCLI(node)

  // จัดการการปิดโปรแกรม
  const stop = async () => {
    await node.stop()
    console.log('\n🛑 libp2p stopped')
    process.exit(0)
  }
  process.on('SIGTERM', stop)
  process.on('SIGINT', stop)
}

main().catch(console.error) 