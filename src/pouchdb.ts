const Ajv = require("ajv")
const ajv = new Ajv()
import { JSONSchema7 } from "json-schema"
import PouchDB from "pouchdb"
PouchDB.plugin(require("pouchdb-find"))
import { ulid } from "ulid"
import { jsonSchemaValidator } from "./validator-plugin"
import { Dog, DogSchema } from "./dog-schema"
PouchDB.plugin(jsonSchemaValidator(DogSchema) as any)

async function testPouchdb(): Promise<void> {
  const db = new PouchDB("testdb")

  //   const max: Dog = {
  //     _id: ulid(),
  //     name: "Max",
  //     age: 5,
  //   }

  const missingAge = {
    _id: "id",
    name: "maxname",
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
  db.put(missingAge)

  const res = await db.find({
    selector: {
      name: "Max",
    },
  })
  const found = res.docs[0]

  const validate = ajv.compile(DogSchema)
  const valid = validate(found)
  if (!valid) {
    console.error(validate.errors)
  }
  console.log(`valid`, valid)

  //   const validationResult = validate(missingAge, DogSchema)
  //   console.log(`validation result is `, validationResult)

  //   console.log(`res are `, res.docs[0])
}

testPouchdb()
