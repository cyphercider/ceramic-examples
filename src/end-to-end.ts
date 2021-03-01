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

    ipldSchema.validate(objectMap.one, "ObjectType")
    ipldSchema.validate(objectMap, "MapType")

    const { cid } = await client.add(JSON.stringify(objectMap), { pin: true })

    const retrieved = await client.get(cid)

    // console.log(`retrieved value is`, JSON.parse(retrieved))
    console.log(`retrieved data is`, retrieved)

    for await (const data of retrieved) {
      // console.log(`got data`, data.toString())
      for await (const innerdata of (data as any).content) {
        console.log(`got innerdata`, innerdata.toString())
      }
    }

    // const { cid } = await client.add("Hello world!", { pin: true })
    // console.log(`cid is`, cid)
    // const retrieved = await client.get(cid)
    // console.log(`retrieved data`, retrieved)
  } catch (err) {
    console.error(`Error in end to end test`)
  }
}

endtoend()
