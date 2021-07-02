import Ajv from "ajv"
// import PouchDB from "pouchdb-node"
import PouchDB from "pouchdb"

import { Bird, BirdSchema, Dog, DogSchema } from "./test-db-schemas"
import { jsonSchemaValidator2 } from "./validator-plugin-v2"

PouchDB.plugin(require("pouchdb-find"))

PouchDB.plugin(jsonSchemaValidator2())

const ajv = new Ajv()
const dogValidator = ajv.compile(DogSchema)
const birdValidator = ajv.compile(BirdSchema)

const dogDb = new PouchDB("dogs")
const birdDb = new PouchDB("birds")

async function testPouchdb(): Promise<void> {
  const dog: Dog = {
    _id: "id",
    name: "maxname",
    age: 10,
  }

  console.log(`writing dog`)
  await dogDb.put(dog, { schemaValidator: dogValidator })

  const bird: Bird = {
    _id: "id",
    name: "maxname",
    wingspan: 98,
  }

  await birdDb.put(bird, { schemaValidator: birdValidator })

  //   const res = await db.find({
  //     selector: {
  //       name: "Max",
  //     },
  //   })
  //   const found = res.docs[0]

  //   const validate = ajv.compile(DogSchema)
  //   const valid = validate(found)
  //   if (!valid) {
  //     console.error(validate.errors)
  //   }
  //   console.log(`valid`, valid)

  //   const validationResult = validate(missingAge, DogSchema)
  //   console.log(`validation result is `, validationResult)

  //   console.log(`res are `, res.docs[0])
}

testPouchdb()
