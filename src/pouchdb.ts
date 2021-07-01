const Ajv = require("ajv")
const ajv = new Ajv()
import { JSONSchema4 } from "json-schema"
import PouchDB from "pouchdb"
PouchDB.plugin(require("pouchdb-find"))
import { ulid } from "ulid"

interface Dog {
  _id: string
  name: string
  age: number
}

const DogSchema: JSONSchema4 = {
  title: "Dog",
  type: "object",
  required: ["_id", "name", "age"],
  properties: {
    _id: {
      type: "string",
      description: "primary key",
    },
    name: {
      type: "string",
      description: "Dog's name",
    },
    age: {
      type: "number",
      description: "dog's age",
    },
  },
}

async function testPouchdb(): Promise<void> {
  const db = new PouchDB("testdb")

  const max: Dog = {
    _id: ulid(),
    name: "Max",
    age: 5,
  }

  const missingAge = {
    _id: "id",
  }

  //   const bo: Dog = {
  //     _id: ulid(),
  //     name: "Bo",
  //     age: 9,
  //   }

  //   await db.createIndex({
  //     index: { fields: ["name"] },
  //   })

  //   db.put(max)
  //   db.put(bo)

  //   const res = await db.find({
  //     selector: {
  //       name: "Max",
  //     },
  //   })
  //   const found = res.docs[0]

  const validate = ajv.compile(DogSchema)
  const valid = validate(max)
  console.log(`valid`, valid)

  //   const validationResult = validate(missingAge, DogSchema)
  //   console.log(`validation result is `, validationResult)

  //   console.log(`res are `, res.docs[0])
}

testPouchdb()
