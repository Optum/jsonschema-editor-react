import * as React from 'react'
import {Flex} from '@chakra-ui/core'
import {SchemaContext} from '../model'
import {AdvancedString} from '../advanced-string'
import {AdvancedNumber} from '../advanced-number'
import {AdvancedBoolean} from '../advanced-boolean'
import {JsonSchemaType} from '../json-schema.types'

export interface AdvancedSettingsProps {
	lens: string[]
}

export const AdvancedSettings: React.FunctionComponent<AdvancedSettingsProps> = (
	props: React.PropsWithChildren<AdvancedSettingsProps>
) => {
	const {lens} = props

	return (
		<SchemaContext.Consumer>
			{schema => {
				const getComponent = (lens: string[]): JSX.Element | undefined => {
					const data = schema.getDataByLens
						? schema.getDataByLens(lens)
						: ({} as JsonSchemaType)
					switch (data.type) {
						case 'string':
							return <AdvancedString lens={lens} />
						case 'number':
						case 'integer':
							return <AdvancedNumber lens={lens} />
						case 'boolean':
							return <AdvancedBoolean lens={lens} />
						default:
							return undefined
					}
				}

				return <Flex>{getComponent(lens)}</Flex>
			}}
		</SchemaContext.Consumer>
	)
}
