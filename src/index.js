import process from 'node:process'
import { createLibp2p } from 'libp2p'
import { multiaddr } from 'multiaddr'
import { createLibp2pConfig } from './config/libp2p.js'
import { handleChatProtocol, setupPeerDiscovery } from './services/connection.js'

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

  // ถ้ามีการระบุ multiaddr ในคำสั่ง ให้เชื่อมต่อกับ peer นั้น
  if (process.argv.length >= 3) {
    const ma = multiaddr(process.argv[2])
    console.log(`💬 Dialing peer at: ${process.argv[2]}`)
    const stream = await node.dialProtocol(ma, '/chat/1.0.0')

    await sendMessage(stream, `Hello to ${ma.toString()}`)

    const encoder = new TextEncoder()
    const message = 'Hello from me!'
    await stream.sink([encoder.encode(message)])
    console.log('📤 Message sent!')
  } else {
    console.log('💡 To send a message, run: node src/index.js <multiaddr>')
  }

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