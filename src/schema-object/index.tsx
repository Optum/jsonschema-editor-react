import * as React from 'react'
import {SchemaItem} from '../schema-item'
import {JsonSchemaObject} from '../json-schema.types'
export interface SchemaObjectProps {
	data: JsonSchemaObject
	lens: string[]
	showAdvanced: (lens: string[]) => void
}

export const SchemaObject: React.FunctionComponent<SchemaObjectProps> = (
	props: React.PropsWithChildren<SchemaObjectProps>
) => {
	const {data, lens, showAdvanced} = props
	return (
		<div className="object-style">
			{Object.keys(data.properties).map((name, index) => {
				return (
					<SchemaItem
						key={String(index)}
						lens={[...lens, name]}
						data={data}
						name={name}
						showAdvanced={showAdvanced}
					/>
				)
			})}
		</div>
	)
}
