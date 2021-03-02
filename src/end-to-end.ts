import createClient from "ipfs-http-client"
import { ClientOptions } from "ipfs-http-client/src/lib/core"
import Schema from "ipld-schema"

// connect to the default API address http://localhost:5001
// const client = createClient();

// connect to a different API
const options: ClientOptions = {
  url: "http://127.0.0.1:5001",
}

const client = createClient(options)

let ipldSchema = new Schema(`
  type ObjectType struct {
    int_member Int
    bool_member Bool
    string_member String
  }
  type MapType { String: ObjectType }
`)

interface ObjectType {
  int_member: number
  bool_member: boolean
  string_member: string
}

interface MapType {
  [key: string]: ObjectType
}

async function endtoend(): Promise<void> {
  try {
    const objectMap: MapType = {
      one: { int_member: 0, bool_member: true, string_member: "hi" },
      two: { int_member: 1, bool_member: false, string_member: "again" },
    }

    const val1 = ipldSchema.validate(objectMap.one, "ObjectType")
    if (!val1) console.log(`error validating ObjectType!`)
    const val2 = ipldSchema.validate(objectMap, "MapType")
    if (!val2) console.log(`error validating MapType!`)

    console.log(`adding content`)
    const { cid } = await client.add(JSON.stringify(objectMap), { pin: true })

    /**
     * Publish to IPNS
     */

    // generate IPNS key
    try {
      const key = await client.key.gen("SecondKey")
    } catch (err) {
      console.error(err)
      console.log(
        `Error generating key, key probably already exists.  Proceeding.`
      )
    }

    const published = await client.name.publish(cid, { key: "SecondKey" })
    console.log(`https://gateway.ipfs.io/ipns/${published.name}`)

    const write2 = await client.add(
      JSON.stringify({
        ...objectMap,
        three: { int_member: 99, bool_member: true, string_member: "mutated" },
      }),
      { pin: true }
    )

    const published2 = await client.name.publish(write2.cid, {
      key: "SecondKey",
    })
    console.log(`https://gateway.ipfs.io/ipns/${published.name}`)

    const retrieved = await client.get(cid)

    // console.log(`retrieved value is`, JSON.parse(retrieved))
    console.log(`retrieved data is`, retrieved)

    for await (const data of retrieved) {
      // console.log(`got data`, data.toString())
      for await (const innerdata of (data as any).content) {
        const rawJson = innerdata.toString()
        console.log(`got innerdata`, innerdata.toString())

        const parsed = JSON.parse(rawJson) as MapType

        const val1 = ipldSchema.validate(parsed.one, "ObjectType")
        if (!val1) console.log(`error validating ObjectType!`)
        const val2 = ipldSchema.validate(parsed, "MapType")
        if (!val2) console.log(`error validating MapType!`)

        console.log(`parsed data is `, parsed)
      }
    }

    // const { cid } = await client.add("Hello world!", { pin: true })
    // console.log(`cid is`, cid)
    // const retrieved = await client.get(cid)
    // console.log(`retrieved data`, retrieved)
  } catch (err) {
    console.error(`Error in end to end test`, err)
  }
}

endtoend()
