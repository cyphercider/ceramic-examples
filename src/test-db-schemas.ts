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
export interface Bird {
  _id: string
  name: string
  wingspan: number
}

export const BirdSchema: JSONSchema7 = {
  title: "Dog",
  type: "object",
  required: ["_id", "name", "wingspan"],
  properties: {
    _id: {
      type: "string",
      description: "primary key",
    },
    name: {
      type: "string",
      description: "Dog's name",
    },
    wingspan: {
      type: "number",
      description: "Bird's wingspan",
    },
  },
}
