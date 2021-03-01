import createClient from "ipfs-http-client"
import { ClientOptions } from "ipfs-http-client/src/lib/core"

// connect to the default API address http://localhost:5001
// const client = createClient();

// connect to a different API
const options: ClientOptions = {
  url: "http://127.0.0.1:5001",
}

const client = createClient(options)

// connect using a URL
// const client = createClient(new URL("http://127.0.0.1:5002"))

// call Core API methods

async function connectAndTest(): Promise<void> {
  try {
    const { cid } = await client.add("Hello world!", { pin: true })
    console.log(`cid is`, cid)
    const retrieved = await client.get(cid)
    console.log(`retrieved data`, retrieved)
  } catch (err) {
    console.error(`Error writing to ipfs!`)
  }
}

connectAndTest()
