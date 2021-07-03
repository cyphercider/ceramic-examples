import PouchDB from "pouchdb"

var pouchBulkDocs = PouchDB.prototype.bulkDocs

function validatorPlugin(body, options, callback) {
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

  

  // All documents check out. Pass them to PouchDB.
  return pouchBulkDocs.call(this, docs, options, callback)
}

export const theSchemaValidator = { bulkDocs: validatorPlugin }
