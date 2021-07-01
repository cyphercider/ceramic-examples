import PouchDB from "pouchdb"
PouchDB.plugin(require("pouchdb-find"))
import { ulid } from "ulid"

interface Dog {
  _id: string
  name: string
  age: number
}

async function testPouchdb(): Promise<void> {
  const db = new PouchDB("testdb")

  const max: Dog = {
    _id: ulid(),
    name: "Max",
    age: 5,
  }

  const bo: Dog = {
    _id: ulid(),
    name: "Bo",
    age: 9,
  }

  await db.createIndex({
    index: { fields: ["name"] },
  })

  db.put(max)
  db.put(bo)

  const res = await db.find({
    selector: {
      name: "Max",
    },
  })

  console.log(`res are `, res)
}

testPouchdb()
