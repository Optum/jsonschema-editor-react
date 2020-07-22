import {
    JsonSchemaType,
    JsonSchemaArray,
    JsonSchemaObject
} from './json-schema.types'

const schemaDraft = 'http://json-schema.org/draft-07/schema'

export const JSONPATH_JOIN_CHAR = '.'

export enum PropertyType {
    SIBLING,
    CHILD
}

export const StringFormat = [
    {name: 'date-time'},
    {name: 'date'},
    {name: 'time'},
    {name: 'email'},
    {name: 'hostname'},
    {name: 'ipv4'},
    {name: 'ipv6'},
    {name: 'uri'},
    {name: 'regex'}
]

export const SchemaTypes = [
    'string',
    'number',
    'array',
    'object',
    'boolean',
    'integer'
]

// interface IData {
//     [key: string]: any | string | number | object
// }

export enum DataType {
    string = 'string',
    number = 'number',
    array = 'arrray',
    object = 'object',
    boolean = 'boolean',
    integer = 'integer'
}

export const getDefaultSchema = (
    dataType: DataType,
    schemaRoot: string | undefined,
    includeSchema?: boolean
): JsonSchemaType | JsonSchemaArray | JsonSchemaObject => {
    switch (dataType) {
        case DataType.string:
        default:
            return includeSchema
                ? {
                      $schema: schemaDraft,
                      $id: schemaRoot ?? '',
                      type: 'string',
                      title: '',
                      description: ''
                  }
                : {
                      $id: schemaRoot ?? '',
                      type: 'string',
                      title: '',
                      description: ''
                  }
        case DataType.number:
            return includeSchema
                ? {
                      $schema: schemaDraft,
                      $id: schemaRoot ?? '',
                      type: 'number',
                      title: '',
                      description: ''
                  }
                : {
                      $id: schemaRoot ?? '',
                      type: 'number',
                      title: '',
                      description: ''
                  }
        case DataType.boolean:
            return includeSchema
                ? {
                      $schema: schemaDraft,
                      $id: schemaRoot ?? '',
                      type: 'boolean',
                      title: '',
                      description: ''
                  }
                : {
                      $id: schemaRoot ?? '',
                      type: 'boolean',
                      title: '',
                      description: ''
                  }
        case DataType.integer:
            return includeSchema
                ? {
                      $schema: schemaDraft,
                      $id: schemaRoot ?? '',
                      type: 'integer',
                      title: '',
                      description: ''
                  }
                : {
                      $id: schemaRoot ?? '',
                      type: 'integer',
                      title: '',
                      description: ''
                  }
        case DataType.array:
            return includeSchema
                ? {
                      $schema: schemaDraft,
                      $id: schemaRoot ?? '',
                      type: 'array',
                      title: '',
                      description: '',
                      items: {
                          $id: schemaRoot ?? '',
                          type: 'string',
                          title: '',
                          description: ''
                      }
                  }
                : {
                      $id: schemaRoot ?? '',
                      type: 'array',
                      title: '',
                      description: '',
                      items: {
                          $id: schemaRoot ?? '',
                          type: 'string',
                          title: '',
                          description: ''
                      }
                  }
        case DataType.object:
            return includeSchema
                ? {
                      $schema: schemaDraft,
                      $id: schemaRoot ?? '',
                      type: 'object',
                      title: '',
                      description: '',
                      properties: {},
                      required: []
                  }
                : {
                      $id: schemaRoot ?? '',
                      type: 'object',
                      title: '',
                      description: '',
                      properties: {},
                      required: []
                  }
    }
}
