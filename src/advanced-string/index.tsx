import * as React from 'react'
import {
	Flex,
	Input,
	FormLabel,
	Stack,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	Checkbox,
	Textarea,
	Select
} from '@chakra-ui/core'

import {SchemaContext} from '../model'
import {getDefaultSchema, StringFormat, DataType} from '../utils'
import {
	JsonSchemaType,
	JsonSchemaString,
	JsonSchemaEnum
} from '../json-schema.types'
export interface SchemaObjectProps {
	lens: string[]
}

export const AdvancedString: React.FunctionComponent<SchemaObjectProps> = (
	props: React.PropsWithChildren<SchemaObjectProps>
) => {
	const {lens} = props

	const onChangeCheckBox = (
		checked: boolean,
		callback: ((newValue: string[] | null, lens: string[]) => void) | undefined
	): void => {
		if (callback) {
			const newState = checked ? new Array<string>() : null
			callback(newState, lens)
		}
	}

	const changeEnumOtherValue = (
		value: string,
		callback: ((newValue: string[] | null, lens: string[]) => void) | undefined
	): void => {
		const array = value.split('\n')
		if (array.length === 0 || (array.length === 1 && !array[0])) {
			if (callback) {
				callback(null, lens)
			}
		} else if (callback) {
			callback(array, lens)
		}
	}

	return (
		<SchemaContext.Consumer>
			{(schema) => {
				const initial: JsonSchemaType = getDefaultSchema(
					DataType.string,
					schema.schemaRoot
				)
				const data = schema.getDataByLens ? schema.getDataByLens(lens) : initial
				const isEnumChecked = (data as JsonSchemaEnum).enum !== undefined
				const enumData = data as JsonSchemaEnum
				const enumValue = enumData?.enum?.join('\n')
				return (
					<Flex direction="column" wrap="nowrap">
						<Stack
							isInline
							alignItems="center"
							justifyContent="center"
							alignContent="center"
							m={1}
						>
							<FormLabel mr={2} htmlFor="default">
								Default:{' '}
							</FormLabel>
							<Input
								id="default"
								placeholder="Default value"
								value={data.default ?? ''}
								onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
									if (schema.changeAdvancedProperty) {
										schema.changeAdvancedProperty(
											evt.target.value,
											lens,
											'default'
										)
									}
								}}
							/>
						</Stack>

						<Stack
							isInline
							alignItems="center"
							justifyContent="center"
							alignContent="center"
							m={1}
						>
							<FormLabel mr={2} htmlFor="default">
								Min Length:{' '}
							</FormLabel>
							<NumberInput
								size="sm"
								onChange={(value: number | string) => {
									if (schema.changeAdvancedProperty) {
										schema.changeAdvancedProperty(
											String(value),
											lens,
											'minLength'
										)
									}
								}}
							>
								<NumberInputField
									value={(data as JsonSchemaString).minLength}
								/>
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
							<FormLabel mr={2} htmlFor="default">
								Max Length:{' '}
							</FormLabel>
							<NumberInput
								size="sm"
								onChange={(value: number | string) => {
									if (schema.changeAdvancedProperty) {
										schema.changeAdvancedProperty(
											String(value),
											lens,
											'maxLength'
										)
									}
								}}
							>
								<NumberInputField
									value={(data as JsonSchemaString).maxLength}
								/>
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
						</Stack>
						<Stack
							isInline
							alignItems="center"
							justifyContent="center"
							alignContent="center"
							m={1}
						>
							<FormLabel mr={2} htmlFor="pattern">
								Pattern:{' '}
							</FormLabel>
							<Input
								id="pattern"
								placeholder="MUST be a valid regular expression."
								value={(data as JsonSchemaString).pattern ?? ''}
								onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
									if (schema.changeAdvancedProperty) {
										schema.changeAdvancedProperty(
											evt.target.value,
											lens,
											'pattern'
										)
									}
								}}
							/>
						</Stack>

						<Stack
							isInline
							alignItems="center"
							justifyContent="center"
							alignContent="center"
							m={1}
						>
							<FormLabel mr={2} htmlFor="default">
								Enum:{' '}
							</FormLabel>
							<Checkbox
								isChecked={isEnumChecked}
								onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
									onChangeCheckBox(evt.target.checked, schema.changeEnum)
								}}
							/>
							<Textarea
								value={enumValue || ''}
								isDisabled={!isEnumChecked}
								placeholder="ENUM Values - One Entry Per Line"
								onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
									changeEnumOtherValue(evt.target.value, schema.changeEnum)
								}}
							/>
						</Stack>
						<Stack
							isInline
							alignItems="center"
							justifyContent="center"
							alignContent="center"
							m={1}
						>
							<FormLabel mr={2} htmlFor="format">
								Format:{' '}
							</FormLabel>
							<Select
								variant="outline"
								value={(data as JsonSchemaString).format ?? ''}
								size="sm"
								margin={2}
								placeholder="Choose data type"
								onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
									if (schema.changeAdvancedProperty) {
										schema.changeAdvancedProperty(
											evt.target.value,
											lens,
											'format'
										)
									}
								}}
							>
								{StringFormat.map((item, index) => {
									return (
										<option key={String(index)} value={item.name}>
											{item.name}
										</option>
									)
								})}
							</Select>
						</Stack>
					</Flex>
				)
			}}
		</SchemaContext.Consumer>
	)
}
