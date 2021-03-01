import * as React from 'react'
import {SchemaObject} from './schema-object'
import {SchemaArray} from './schama-array'
import {
	JsonSchemaType,
	JsonSchemaArray,
	JsonSchemaObject
} from './json-schema.types'
export const getComponent = (
	data: JsonSchemaType,
	lens: string[],
	showAdvanced: (lens: string[]) => void
): JSX.Element | undefined => {
	switch (data.type) {
		case 'array':
			return (
				<SchemaArray
					lens={[...lens, 'items']}
					data={data as JsonSchemaArray}
					showAdvanced={showAdvanced}
				/>
			)

		case 'object':
			return (
				<SchemaObject
					lens={[...lens, 'properties']}
					data={data as JsonSchemaObject}
					showAdvanced={showAdvanced}
				/>
			)

		default:
			return undefined
	}
}
