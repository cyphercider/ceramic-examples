import { IpfsDaemon } from "@ceramicnetwork/ipfs-daemon"

let ipfsDaemon: any

const IPFS_DHT_SERVER_MODE = true

async function runDaemon() {
  // All the parameters are optional here
  // If not set, they are given defaults or got read from process environment variables
  ipfsDaemon = await IpfsDaemon.create({
    ipfsDhtServerMode: IPFS_DHT_SERVER_MODE, // DHT Server
    ipfsEnableApi: true, // Enable IPFS API
    ipfsEnableGateway: true, // Enable IPFS Gateway
    useCentralizedPeerDiscovery: true, // Connect to bootstrap nodes
    ceramicNetwork: "testnet-clay", // Bootstrap nodes are selected per network
  })
  await ipfsDaemon.start()
}

runDaemon()

process.on("beforeExit", async () => {
  await ipfsDaemon.stop()
})
