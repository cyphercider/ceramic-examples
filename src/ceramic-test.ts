import CeramicClient from "@ceramicnetwork/http-client"
import { randomBytes } from "@stablelib/random"
import { Ed25519Provider } from "key-did-provider-ed25519"
import KeyResolver from "key-did-resolver"
import { DID } from "dids"

const API_URL = "http://localhost:7007"

/**
 * using guide at https://developers.ceramic.network/build/quick-start/
 * using provider athttps://github.com/ceramicnetwork/key-did-provider-ed25519
 * Using ceramic http clienthttps://github.com/ceramicnetwork/js-ceramic/blob/develop/packages/http-client/src/ceramic-http-client.ts
 */

async function testCeramic() {
  const ceramic = new CeramicClient(API_URL)
  const seed = randomBytes(32)
  const provider = new Ed25519Provider(seed)
  await ceramic.setDIDProvider(provider)

  const did = new DID({ provider, resolver: KeyResolver.getResolver() })
  await did.authenticate()

  console.log(`provider`, did.id)

  const doc = await ceramic.createDocument("tile", {
    content: { foo: "bar" },
    metadata: {
      controllers: [did.id],
      family: "doc family",
    },
  })

  const loadedDoc = await ceramic.loadDocument(doc.id)
  console.log(`loaded the doc `, loadedDoc.content)
}

testCeramic()
