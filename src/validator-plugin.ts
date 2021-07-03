import { JSONSchema4, JSONSchema6, JSONSchema7 } from "json-schema"
// import PouchDB from "pouchdb-node"
import PouchDB from "pouchdb"

const Ajv = require("ajv")
/**
 * pluchdb plugins
 * https://pouchdb.com/external.html
 * api
 * https://pouchdb.com/api.html#plugins
 * typescript example plugins
 * https://github.com/pouchdb-community/relational-pouch
 *
 * global plugins issue: https://github.com/pouchdb/pouchdb/issues/7198
 *
 */

export function jsonSchemaValidator(
  schema: JSONSchema4 | JSONSchema6 | JSONSchema7
) {
  console.log(`IN VALIDATOR`)
  const ajv = new Ajv()
  const validate = ajv.compile(schema)
  const pouchBulkDocs = PouchDB.prototype.bulkDocs

  return {
    bulkDocs: (body, options, callback) => {
      console.log(`options are`, options)

      if (typeof options == "function") {
        callback = options
        options = {}
      }

      let docs
      if (Array.isArray(body)) {
        docs = body
      } else {
        docs = body.docs
      }

      for (var i = 0; i < docs.length; i++) {
        const valid = validate(docs[i])
        if (!valid) {
          return callback(new Error(validate.errors[0].message))
        }
      }

      //@ts-ignore
      const that = this

      console.log(`finishing`)
      // All documents check out. Pass them to PouchDB.
      return pouchBulkDocs.call(that, docs, options, callback)
    },
  }
}
