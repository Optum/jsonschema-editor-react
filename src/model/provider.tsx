import * as React from 'react'
import * as R from 'ramda'
import {SchemaContext} from './context'
import {PropertyType, getDefaultSchema, DataType} from '../utils'
import {JsonSchemaObject, JsonSchemaType} from '../json-schema.types'
import Ajv from 'ajv'

const ajv = new Ajv()

export type SchemaProviderProps = {
	data?: JsonSchemaType
	readOnly?: boolean
	schemaRoot: string
}

export const SchemaProvider: React.FunctionComponent<SchemaProviderProps> = (
	props: React.PropsWithChildren<SchemaProviderProps>
) => {
	const errorMessage = ''
	const defaultSchema: JsonSchemaObject = {
		$schema: 'http://json-schema.org/draft-07/schema#',
		$id: props.schemaRoot,
		type: 'object',
		title: 'title',
		description: '',
		properties: {},
		required: []
	}

	const countKeys = (object: any): number => {
		if (typeof object !== 'object' || object === null) {
			return 0
		}

		const keys = Object.keys(object)
		let sum = keys.length
		for (const key of keys) {
			sum += countKeys(object[key])
		}

		return sum
	}

	const defaultState: JsonSchemaType =
		props.data === undefined ? defaultSchema : props.data

	const isValidSchema = (): boolean => {
		const isValid = ajv.validateSchema(defaultState)
		return isValid
	}

	const [state, setState] = React.useState({
		schema: defaultState,
		fieldId: countKeys(props.data),
		isValid: isValidSchema(),
		errorMessage
	})

	const [isReadOnly] = React.useState(props.readOnly ?? false)
	const [schemaRoot] = React.useState(props.schemaRoot ?? '')

	const renameKeys = R.curry((keysMap: Record<string, string>, object: any) =>
		R.reduce(
			(acc: any, key: string) => {
				const k = R.has(key, keysMap) ? keysMap[key] : key
				acc[k] = object[key]
				return acc
			},
			{},
			R.keys(object) as string[]
		)
	)

	return (
		<SchemaContext.Provider
			value={{
				jsonSchema: state.schema,
				isValidSchema: state.isValid,
				isReadOnly,
				schemaRoot,
				handleNameChange: (newValue: string, lens: string[]) => {
					const map = {[lens[lens.length - 1]]: newValue}
					const propsLens = R.lensPath(lens.slice(0, -1))
					const propView = R.view(propsLens, state.schema)
					const newProperties = renameKeys(map, propView)

					const newState = R.set(propsLens, newProperties, state.schema)
					setState({
						schema: newState,
						fieldId: state.fieldId,
						isValid: state.isValid,
						errorMessage: state.errorMessage
					})
				},
				handleTitleChange: (newValue: string, lens: string[]): void => {
					const idLens = R.lensPath([...lens, '$id'])
					const titleLens = R.lensPath([...lens, 'title'])
					let newId = `${schemaRoot}${newValue.toLowerCase()}`
					newId = newId.replace(/\s/g, '')
					const updatedId = R.set(idLens, newId, state.schema)
					const newState = R.set(titleLens, newValue, updatedId)
					setState({
						schema: newState,
						fieldId: state.fieldId,
						isValid: state.isValid,
						errorMessage: state.errorMessage
					})
				},
				handleTypeChange: (newValue: string, lens: string[]) => {
					if (lens.length > 0) {
						const typeLens = R.lensPath(lens)
						const dataTypeValue: DataType = (DataType as any)[newValue]
						const newState = R.set(
							typeLens,
							getDefaultSchema(dataTypeValue, schemaRoot),
							state.schema
						)
						setState({
							schema: newState,
							fieldId: state.fieldId,
							isValid: state.isValid,
							errorMessage: state.errorMessage
						})
					} else {
						switch (newValue) {
							case 'array':
								setState({
									schema: getDefaultSchema(DataType.array, schemaRoot, true),
									fieldId: state.fieldId,
									isValid: state.isValid,
									errorMessage: state.errorMessage
								})
								break

							case 'object':
								setState({
									schema: getDefaultSchema(DataType.object, schemaRoot, true),
									fieldId: state.fieldId,
									isValid: state.isValid,
									errorMessage: state.errorMessage
								})
								break
							default:
						}
					}
				},
				handleDescriptionChange: (newValue: string, lens: string[]) => {
					const titleLens = R.lensPath([...lens, 'description'])

					const newState = R.set(titleLens, newValue, state.schema)
					setState({
						schema: newState,
						fieldId: state.fieldId,
						isValid: state.isValid,
						errorMessage: state.errorMessage
					})
				},
				deleteItem: (lens: string[]) => {
					const propertyName = lens[lens.length - 1]
					const requiredLens = R.lensPath([...lens.splice(0, -1), 'required'])
					const currentRequired = R.view<JsonSchemaType, string[]>(
						requiredLens,
						state.schema
					)
					const indexOfRequired = currentRequired.indexOf(propertyName)

					currentRequired.splice(indexOfRequired, 1)

					const newState = R.dissocPath<JsonSchemaType>(lens, state.schema)

					setState({
						schema: newState,
						fieldId: state.fieldId,
						isValid: state.isValid,
						errorMessage: state.errorMessage
					})
				},
				addItem: (lens: string[], type: PropertyType) => {
					const fieldName = `field_${String(state.fieldId++)}`
					lens =
						type === PropertyType.SIBLING
							? [...lens.slice(0, -1), fieldName]
							: [...lens, fieldName]

					const addPath = R.lensPath(lens)
					const newState = R.set(
						addPath,
						getDefaultSchema(DataType.string, schemaRoot),
						state.schema
					)

					setState({
						schema: newState,
						fieldId: state.fieldId++,
						isValid: state.isValid,
						errorMessage: state.errorMessage
					})
				},
				changeAdvancedProperty: (
					newValue: any,
					lens: string[],
					property: string
				) => {
					const propertyLens = R.lensPath([...lens, property])

					const correctNewValue =
						Number(newValue) === undefined ? newValue : Number(newValue)

					const newState = R.set(propertyLens, correctNewValue, state.schema)
					setState({
						schema: newState,
						fieldId: state.fieldId,
						isValid: state.isValid,
						errorMessage: state.errorMessage
					})
				},
				changeEnum: (newValue: string[] | null, lens: string[]) => {
					const propertyLens = R.lensPath([...lens, 'enum'])
					let newState: JsonSchemaType
					if (newValue === null) {
						newState = R.dissocPath<JsonSchemaType>(
							[...lens, 'enum'],
							state.schema
						)
					} else {
						const typeLens = R.lensPath(lens)

						const propType = R.view<JsonSchemaType, JsonSchemaType>(
							typeLens,
							state.schema
						)
						const correctNewValue =
							propType.type === 'number'
								? newValue.map(s => (s === '' ? s : Number(s)))
								: newValue

						newState = R.set(propertyLens, correctNewValue, state.schema)
					}

					setState({
						schema: newState,
						fieldId: state.fieldId,
						isValid: state.isValid,
						errorMessage: state.errorMessage
					})
				},
				getDataByLens: (lens: string[]) => {
					const propertyLens = R.lensPath(lens)

					const data = JSON.parse(
						JSON.stringify(R.view(propertyLens, state.schema))
					)

					return data
				},
				handleRequiredChange: (newValue: boolean, lens: string[]) => {
					const propertyName = lens[lens.length - 1]

					const requiredPath = lens.slice(0, -2)
					const requiredLens = R.lensPath(requiredPath)

					const currentState = R.view<JsonSchemaType, JsonSchemaObject>(
						requiredLens,
						state.schema
					)

					if (!currentState.required) {
						currentState.required = new Array<string>()
					}

					const indexOfRequired = currentState.required.indexOf(propertyName)

					if (!newValue && indexOfRequired >= 0) {
						currentState.required.splice(indexOfRequired, 1)
					} else if (newValue && indexOfRequired === -1) {
						currentState.required.push(propertyName)
					}

					const newState = R.set(requiredLens, currentState, state.schema)

					setState({
						schema: newState,
						fieldId: state.fieldId,
						isValid: state.isValid,
						errorMessage: state.errorMessage
					})
				}
			}}
		>
			{props.children}
		</SchemaContext.Provider>
	)
}
