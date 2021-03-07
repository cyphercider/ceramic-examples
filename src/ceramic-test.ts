import CeramicClient from "@ceramicnetwork/http-client"
import { randomBytes } from "@stablelib/random"
import { Ed25519Provider } from "key-did-provider-ed25519"
import KeyResolver from "key-did-resolver"
import { DID } from "dids"

const API_URL = "http://localhost:7007"

/**
 * using guide at https://developers.ceramic.network/build/quick-start/
 * using provider at https://github.com/ceramicnetwork/key-did-provider-ed25519
 * Using ceramic http client https://github.com/ceramicnetwork/js-ceramic/blob/develop/packages/http-client/src/ceramic-http-client.ts
 * Using schemas: https://developers.ceramic.network/build/quick-start/#create-a-schema
 */

async function testCeramic() {
  const ceramic = new CeramicClient(API_URL)
  const seed = randomBytes(32)
  const provider = new Ed25519Provider(seed)
  await ceramic.setDIDProvider(provider)

  // const did = new DID({ provider, resolver: KeyResolver.getResolver() })
  // await did.authenticate()

  // console.log(`provider`, did.id)
  const schema = await ceramic.createDocument("tile", {
    content: {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "QuickStartSchema",
      type: "object",
      properties: {
        foo: { type: "string" },
      },
      required: ["foo"],
    },
    metadata: {
      controllers: [ceramic?.did?.id || ""],
      family: "schema",
    },
  })

  const doc = await ceramic.createDocument("tile", {
    content: { foo: "bar" },
    metadata: {
      schema: schema.commitId.toUrl(),
      controllers: [ceramic?.did?.id || ""],
      family: "doc family",
    },
  })

  ceramic.pin.add(doc.id)

  const loadedDoc = await ceramic.loadDocument(doc.id)
  console.log(`loaded the doc `, loadedDoc.content)
}

testCeramic()
