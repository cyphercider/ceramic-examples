import { JSONSchema7 } from "json-schema"

export interface Dog {
  _id: string
  name: string
  age: number
}

export const DogSchema: JSONSchema7 = {
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
