import PouchDB from "pouchdb"
import { JSONSchema7 } from "json-schema" // Optional for those who want strong typing of schema definitions
import { jsonSchemaValidator } from "@worldgraph/pouchdb-jsonschema"
import Ajv from "ajv"

const DogSchema: JSONSchema7 = {
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

PouchDB.plugin(jsonSchemaValidator)
const ajv = new Ajv()
const dogValidator = ajv.compile(DogSchema)

async function testError() {
  const db = new PouchDB("testdb")
  const missingAge = {
    _id: new Date().getTime().toString(), // or any other id generating expression
    name: "maxname",
    age: 15,
  }

  await db.put(missingAge, { schemaValidator: dogValidator })

  const res = await db.get(missingAge._id)
  console.log(`res`, res)
}

// Will throw exception `Error: should have required property 'age'`
testError()
