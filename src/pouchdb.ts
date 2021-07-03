import Ajv from "ajv"
// import PouchDB from "pouchdb-node"
import PouchDB from "pouchdb"
import pouchDebug from "pouchdb-debug"

import { Bird, BirdSchema, Dog, DogSchema } from "./test-db-schemas"
import { ulid } from "ulid"
import { theSchemaValidator } from "./sillyvalidator"

PouchDB.plugin(require("pouchdb-find"))

PouchDB.plugin(pouchDebug)
// PouchDB.plugin(jsonSchemaValidator2())
console.log(`init`)
PouchDB.plugin(theSchemaValidator as any)

const ajv = new Ajv()
const dogValidator = ajv.compile(DogSchema)
const birdValidator = ajv.compile(BirdSchema)

const dogDb = new PouchDB("dogs")
const birdDb = new PouchDB("birds")

async function testPouchdb(): Promise<void> {
  const dog: Dog = {
    _id: ulid(),
    name: "maxname",
    age: 10,
  }

  delete dog.name
  console.log(`writing dog`)
  try {
    await dogDb.put(dog, { schemaValidator: dogValidator })
  } catch (err) {
    console.log(`got error putting dog`)
    console.log(err)
  }

  const bird: Bird = {
    _id: ulid(),
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
