import CeramicClient from "@ceramicnetwork/http-client"
import { randomBytes } from "@stablelib/random"
import { Ed25519Provider } from "key-did-provider-ed25519"
import KeyResolver from "key-did-resolver"
import { DID } from "dids"
import ThreeIdProvider from "3id-did-provider"

const API_URL = "http://localhost:7007"

/**
 * using guide at https://developers.ceramic.network/build/quick-start/
 * using provider athttps://github.com/ceramicnetwork/key-did-provider-ed25519
 * Using ceramic http clienthttps://github.com/ceramicnetwork/js-ceramic/blob/develop/packages/http-client/src/ceramic-http-client.ts
 */

async function testCeramic() {
  const ceramic = new CeramicClient(API_URL)
  const seed = randomBytes(32)
  // const provider = new Ed25519Provider(seed)
  const getPermission = async () => {
    return new Promise<string[]>((resolve, _) => {
      resolve(["/"])
    })
  }

  console.log(`Making provider...`)
  const threeId = await ThreeIdProvider.create({
    getPermission: getPermission,
    seed: seed,
    ceramic: ceramic,
  })
  const provider = threeId.getDidProvider()
  const did = new DID({ provider })

  console.log(`authenticating...`)
  await did.authenticate()

  console.log(`setting provider...`)
  await ceramic.setDIDProvider(provider)

  console.log(`provider`, did.id)

  const doc = await ceramic.createDocument("tile", {
    content: { foo: "bar" },
    metadata: {
      schema: "ceramic://kyz123456",
      controllers: [did.id],
      family: "doc family",
    },
  })

  const loadedDoc = await ceramic.loadDocument(doc.id)
  console.log(`loaded the doc `, loadedDoc.metadata)
}

testCeramic()
