import CeramicClient from "@ceramicnetwork/http-client"
import { Ed25519Provider } from "key-did-provider-ed25519"
import { randomBytes } from "@stablelib/random"
import ThreeIdProvider from "3id-did-provider"

const API_URL = "http://localhost:7007"

/**
 * using guide at https://developers.ceramic.network/build/quick-start/

 */

async function testCeramic() {
  const ceramic = new CeramicClient(API_URL)
  const seed = randomBytes(32)
  const provider = new Ed25519Provider(seed)
  await ceramic.setDIDProvider(provider)

  const doc = await ceramic.createDocument("tile", {
    content: { foo: "bar" },
    metadata: {
      schema: "ceramic://kyz123...456",
      controllers: ["did:3:kyz123...456"],
      family: "doc family",
    },
  })

  const loadedDoc = await ceramic.loadDocument(doc.id)
  console.log(`loaded the doc `, loadedDoc.metadata)
}

testCeramic()
