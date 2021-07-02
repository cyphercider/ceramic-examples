import { JSONSchema4, JSONSchema6, JSONSchema7 } from "json-schema"
const Ajv = require("ajv")
import PouchDB from "pouchdb"

/**
 * pluchdb plugins
 * https://pouchdb.com/external.html
 * api
 * https://pouchdb.com/api.html#plugins
 * typescript example plugins
 * https://github.com/pouchdb-community/relational-pouch
 */

export function jsonSchemaValidator(
  schema: JSONSchema4 | JSONSchema6 | JSONSchema7
) {
  const ajv = new Ajv()
  const validate = ajv.compile(schema)
  const pouchBulkDocs = PouchDB.prototype.bulkDocs

  return {
    bulkDocs: (body, options, callback) => {
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

      // All documents must have a .name field.
      for (var i = 0; i < docs.length; i++) {
        const valid = validate(docs[i])
        if (!valid) {
          return callback(new Error(validate.errors[0].message))
        }
      }

      //@ts-ignore
      const that = this

      // All documents check out. Pass them to PouchDB.
      return pouchBulkDocs.call(that, docs, options, callback)
    },
  }
}
