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

const pouchBulkDocs = PouchDB.prototype.bulkDocs
export function jsonSchemaValidator2() {
  console.log(`IN VALIDATOR`)

  return {
    bulkDocs: (body, options, callback) => {
      console.log(`IN BULK DOCS`)
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

      if (options.schemaValidator) {
        console.log(`setting validator`)
        const validate = options.schemaValidator
        if (typeof validate !== "function") {
          return callback(
            new Error(`schemaValidator option passed must be a function!`)
          )
        }

        for (var i = 0; i < docs.length; i++) {
          try {
            const valid = validate(docs[i])
            if (!valid) {
              return callback(new Error(validate.errors[0].message))
            }
          } catch (err) {
            return callback(new Error(`Error calling schema validator!`))
          }
        }
      } else {
        return callback(
          new Error(
            `JSON Schema validation is enabled, but no validator was passed!`
          )
        )
      }

      const that = this

      // All documents check out. Pass them to PouchDB.
      console.log(`calling final`)
      return pouchBulkDocs.call(that, docs, options, callback)
    },
  }
}
