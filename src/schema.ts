import Schema from "ipld-schema";

let schema = new Schema(`
  type SimpleStruct struct {
    foo Int
    bar Bool
    baz String
  }
  type MyMap { String: SimpleStruct }
`);

console.dir(schema.descriptor, { depth: Infinity });
