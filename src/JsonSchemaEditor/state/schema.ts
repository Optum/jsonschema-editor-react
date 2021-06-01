import { createState, State } from "@hookstate/core";
import { JSONSchema7 } from "../JsonSchemaEditor.types";
import Ajv from "ajv";
import { Schema2 } from "../JsonSchemaEditor.types";
const ajv = new Ajv();

export const defaultSchema = (): JSONSchema7 => {
  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    title: "title",
    description: "",
    properties: {},
    required: [],
  };
};

const countKeys = (object: any): number => {
  if (typeof object !== "object" || object === null) {
    return 0;
  }

  const keys = Object.keys(object);
  let sum = keys.length;
  for (const key of keys) {
    sum += countKeys(object[key]);
  }

  return sum;
};

const isValidSchema = (schema: JSONSchema7): boolean => {
  const isValid = ajv.validateSchema(schema);
  return isValid;
};

export const useSchemaState = (initialState: Schema2): State<Schema2> => {
  if (initialState.jsonSchema === undefined) {
    initialState.jsonSchema = defaultSchema();
  }

  initialState.isValidSchema = isValidSchema(initialState.jsonSchema);
  return createState<Schema2>(initialState);
};
