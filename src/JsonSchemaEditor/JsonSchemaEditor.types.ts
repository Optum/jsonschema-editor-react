import { State } from "@hookstate/core";

export interface SchemaEditorProps {
  /**
   * Text component
   */
  data?: JSONSchema7 | undefined;
  onSchemaChange: (results: string) => void;
  readOnly?: boolean;
}

export type Schema2 = {
  jsonSchema: JSONSchema7;
  isValidSchema?: boolean;
  errorMessage?: string;
  isReadOnly: boolean;
  fieldId: number;
};
export interface AdvancedItemStateProps {
  itemStateProp: State<JSONSchema7>;
}

//==================================================================================================
// JSON Schema Draft 07
//==================================================================================================
// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01
//--------------------------------------------------------------------------------------------------

/**
 * Primitive type
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1.1
 */
export type JSONSchema7TypeName =
  | "string" //
  | "number"
  | "integer"
  | "boolean"
  | "object"
  | "array"
  | "null";

/**
 * Primitive type
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1.1
 */
export type JSONSchema7Type =
  | string //
  | number
  | boolean
  | JSONSchema7Object
  | JSONSchema7Array
  | null;

// Workaround for infinite type recursion
export interface JSONSchema7Object {
  [key: string]: JSONSchema7Type;
}

// Workaround for infinite type recursion
// https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
export interface JSONSchema7Array extends Array<JSONSchema7Type> {}

/**
 * Meta schema
 *
 * Recommended values:
 * - 'http://json-schema.org/schema#'
 * - 'http://json-schema.org/hyper-schema#'
 * - 'http://json-schema.org/draft-07/schema#'
 * - 'http://json-schema.org/draft-07/hyper-schema#'
 *
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-5
 */
export type JSONSchema7Version = string;

/**
 * JSON Schema v7
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01
 */
export type JSONSchema7Definition = JSONSchema7 | boolean;
export interface JSONSchema7 {
  $id?: string;
  $ref?: string;
  $schema?: JSONSchema7Version;
  $comment?: string;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1
   */
  type?: JSONSchema7TypeName | JSONSchema7TypeName[];
  enum?: JSONSchema7Type[];
  const?: JSONSchema7Type;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.2
   */
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.3
   */
  maxLength?: number;
  minLength?: number;
  pattern?: string;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.4
   */
  items?: JSONSchema7Definition | JSONSchema7Definition[];
  additionalItems?: JSONSchema7Definition;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  contains?: JSONSchema7;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.5
   */
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  properties?: {
    [key: string]: JSONSchema7Definition;
  };
  patternProperties?: {
    [key: string]: JSONSchema7Definition;
  };
  additionalProperties?: JSONSchema7Definition;
  dependencies?: {
    [key: string]: JSONSchema7Definition | string[];
  };
  propertyNames?: JSONSchema7Definition;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.6
   */
  if?: JSONSchema7Definition;
  then?: JSONSchema7Definition;
  else?: JSONSchema7Definition;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.7
   */
  allOf?: JSONSchema7Definition[];
  anyOf?: JSONSchema7Definition[];
  oneOf?: JSONSchema7Definition[];
  not?: JSONSchema7Definition;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-7
   */
  format?: string;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-8
   */
  contentMediaType?: string;
  contentEncoding?: string;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-9
   */
  definitions?: {
    [key: string]: JSONSchema7Definition;
  };

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-10
   */
  title?: string;
  description?: string;
  default?: JSONSchema7Type;
  readOnly?: boolean;
  writeOnly?: boolean;
  examples?: JSONSchema7Type;
}
