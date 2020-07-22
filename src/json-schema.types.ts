type Defaults = string | [] | null

export interface JsonSchemaType {
    $schema?: string
    $id: string
    type: string
    title: string
    description: string
    default?: Defaults
    examples?: Defaults
}

// Todo: update in a2j
export interface JsonSchemaProperties {
    [x: string]: JsonSchemaType | JsonSchemaObject | JsonSchemaArray
}

// Todo: update in a2j
export interface JsonSchemaString extends JsonSchemaType {
    format?: string
    pattern?: string
    minLength?: number
    maxLength?: number
}

export type JsonSchemaBoolean = JsonSchemaType
export type JsonSchemaInt = JsonSchemaType
export type JsonSchemaNumber = JsonSchemaType

export interface JsonSchemaRange extends JsonSchemaType {
    minimum?: number
    exclusiveMinimum?: number
    maximum?: number
    exclusiveMaximum?: number
}

export interface JsonSchemaEnum extends JsonSchemaType {
    enum: string[]
}

export interface JsonSchemaArray extends JsonSchemaType {
    items: JsonSchemaType | JsonSchemaObject | JsonSchemaArray
}

export interface JsonSchemaObject extends JsonSchemaType {
    required: string[]
    properties: JsonSchemaProperties
}
