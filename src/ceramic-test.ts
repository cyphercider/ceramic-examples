import CeramicClient, { CeramicClientConfig } from "@ceramicnetwork/http-client"
import { randomBytes } from "@stablelib/random"
import { Ed25519Provider } from "key-did-provider-ed25519"
import { ulid } from "ulid"
import KeyDidResolver from "key-did-resolver"
import { DID } from "dids"
import { TileDocument } from '@ceramicnetwork/stream-tile'


const API_URL = "http://localhost:7007"

/**
 * using guide at https://developers.ceramic.network/build/quick-start/
 * using provider at https://github.com/ceramicnetwork/key-did-provider-ed25519
 * Using ceramic http client https://github.com/ceramicnetwork/js-ceramic/blob/develop/packages/http-client/src/ceramic-http-client.ts
 * Using schemas: https://developers.ceramic.network/build/quick-start/#create-a-schema
 */

async function testCeramic() {
  const ceramic = new CeramicClient(API_URL)
	const resolver = { ...KeyDidResolver.getResolver()}
	const did = new DID({ resolver })
	ceramic.did = did


	// const doc = await TileDocument.create(ceramic, content, metadata, opts)

	// const streamId = doc.id.toString()

	const seed = randomBytes(32)
	const provider = new Ed25519Provider(seed)
	ceramic.did.setProvider(provider)
	await ceramic.did.authenticate()

  const schema = await TileDocument.create(ceramic, {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "QuickStartSchema",
      type: "object",
      properties: {
        id: { type: "string" },
        foo: { type: "string" },
        revision: { type: "number" },
      },
      required: ["foo"],
    },
    {
      controllers: [ceramic?.did?.id || ""],
      family: "schema",
    },
  )

  const doc = await TileDocument.create(ceramic, 
     { id: ulid(), foo: "bar", revision: 1 },
     {
      schema: schema.commitId.toUrl(),
      controllers: [ceramic?.did?.id || ""],
      family: "test family",
    },
  )

  ceramic.pin.add(doc.id)

  const loadedDoc = await TileDocument.load(ceramic, doc.id)
  console.log(`loaded the doc `, loadedDoc.content)


  loadedDoc.update({
     ...loadedDoc.content as any, revision: (loadedDoc.content as any).revision + 1 
  })

  await listDocsOfFamily("test family", ceramic)
}

async function listDocsOfFamily(
  docFamily: string,
  ceramic: CeramicClient
): Promise<void> {
  const docList = await ceramic.pin.ls()
  for await (let docId of docList) {
//     const pinnedDoc = await ceramic.loadDocument(docId)
    const pinnedDoc = await TileDocument.load(ceramic, docId)
    if (pinnedDoc.state.metadata.family === docFamily) {
      // console.log(`pinned doc`, pinnedDoc.content)

      try {
        await pinnedDoc.update({
            ...pinnedDoc.content as any,
            revision: (pinnedDoc.content as any).revision + 1,
        })

        console.log(`UPDATED docId`, docId)
        console.log(pinnedDoc.content)
        console.log(pinnedDoc.id)
        console.log(pinnedDoc)
      } catch (err) {
        // TODO- figure out why I can't update these
        // console.log(`could not update docId`, docId, err)
        continue
      }
    }
  }
}

testCeramic()
