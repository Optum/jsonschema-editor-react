import * as R from "ramda";
import { PropertyType, getDefaultSchema, DataType } from "../utils";
import { JsonSchemaObject, JsonSchemaType } from "../../JsonSchemaEditor.types";
import { Schema, SchemaHandler } from "../../JsonSchemaEditor.types";

const renameKeys = R.curry((keysMap: Record<string, string>, object: any) =>
	R.reduce(
		(acc: any, key: string) => {
			const k = R.has(key, keysMap) ? keysMap[key] : key;
			acc[k] = object[key];
			return acc;
		},
		{},
		R.keys(object) as string[]
	)
);

export const schemaHandler: SchemaHandler = {
	handleNameChange: (
		state: Schema,
		newValue: string,
		lens: string[]
	): JsonSchemaType => {
		const map = { [lens[lens.length - 1]]: newValue };
		const propsLens = R.lensPath(lens.slice(0, -1));
		const propView = R.view(propsLens, state.jsonSchema);
		const newProperties = renameKeys(map, propView);

		const newState = R.set(propsLens, newProperties, state.jsonSchema);
		return newState;
	},
	handleTitleChange: (
		state: Schema,
		newValue: string,
		lens: string[]
	): JsonSchemaType => {
		const idLens = R.lensPath([...lens, "$id"]);
		const titleLens = R.lensPath([...lens, "title"]);
		let newId = `${state.schemaRoot}${newValue.toLowerCase()}`;
		newId = newId.replace(/\s/g, "");
		const updatedId = R.set(idLens, newId, state.jsonSchema);
		const newState = R.set(titleLens, newValue, updatedId);
		return newState;
	},
	handleTypeChange: (
		state: Schema,
		newValue: string,
		lens: string[]
	): JsonSchemaType => {
		if (lens.length > 0) {
			const typeLens = R.lensPath(lens);
			const dataTypeValue: DataType = (DataType as any)[newValue];
			const newState = R.set(
				typeLens,
				getDefaultSchema(dataTypeValue, state.schemaRoot),
				state.jsonSchema
			);
			return newState;
		} else {
			switch (newValue) {
				case "array":
					return getDefaultSchema(DataType.array, state.schemaRoot, true);
				case "object":
					return getDefaultSchema(DataType.object, state.schemaRoot, true);
				default:
					return getDefaultSchema(DataType.object, state.schemaRoot, true);
			}
		}
	},
	handleDescriptionChange: (
		state: Schema,
		newValue: string,
		lens: string[]
	): JsonSchemaType => {
		const titleLens = R.lensPath([...lens, "description"]);

		const newState = R.set(titleLens, newValue, state.jsonSchema);
		return newState;
	},
	deleteItem: (state: Schema, lens: string[]): JsonSchemaType => {
		const propertyName = lens[lens.length - 1];
		const requiredLens = R.lensPath([...lens.splice(0, -1), "required"]);
		const currentRequired = R.view<JsonSchemaType, string[]>(
			requiredLens,
			state.jsonSchema
		);
		const indexOfRequired = currentRequired.indexOf(propertyName);

		currentRequired.splice(indexOfRequired, 1);

		const newState = R.dissocPath<JsonSchemaType>(lens, state.jsonSchema);

		return newState;
	},
	addItem: (
		state: Schema,
		lens: string[],
		type: PropertyType
	): [JsonSchemaType, number] => {
		const fieldName = `field_${String(state.fieldId + 1)}`;
		lens =
			type === PropertyType.SIBLING
				? [...lens.slice(0, -1), fieldName]
				: [...lens, fieldName];

		const addPath = R.lensPath(lens);
		const newState = R.set(
			addPath,
			getDefaultSchema(DataType.string, state.schemaRoot),
			state.jsonSchema
		);

		return [newState, state.fieldId + 1];
	},
	changeAdvancedProperty: (
		state: Schema,
		newValue: any,
		lens: string[],
		property: string
	): JsonSchemaType => {
		const propertyLens = R.lensPath([...lens, property]);

		const correctNewValue =
			Number(newValue) === undefined ? newValue : Number(newValue);

		const newState = R.set(propertyLens, correctNewValue, state.jsonSchema);
		return newState;
	},
	changeEnum: (
		state: Schema,
		newValue: string[] | null,
		lens: string[]
	): JsonSchemaType => {
		const propertyLens = R.lensPath([...lens, "enum"]);
		let newState: JsonSchemaType;
		if (newValue === null) {
			newState = R.dissocPath<JsonSchemaType>(
				[...lens, "enum"],
				state.jsonSchema
			);
		} else {
			const typeLens = R.lensPath(lens);

			const propType = R.view<JsonSchemaType, JsonSchemaType>(
				typeLens,
				state.jsonSchema
			);
			const correctNewValue =
				propType.type === "number"
					? newValue.map((string) => (string === "" ? string : Number(string)))
					: newValue;

			newState = R.set(propertyLens, correctNewValue, state.jsonSchema);
		}

		return newState;
	},
	getDataByLens: (state: Schema, lens: string[]): JsonSchemaType => {
		const propertyLens = R.lensPath(lens);

		const data = JSON.parse(
			JSON.stringify(R.view(propertyLens, state.jsonSchema))
		);

		return data;
	},
	handleRequiredChange: (
		state: Schema,
		newValue: boolean,
		lens: string[]
	): JsonSchemaType => {
		const propertyName = lens[lens.length - 1];

		const requiredPath = lens.slice(0, -2);
		const requiredLens = R.lensPath(requiredPath);

		const currentState = R.view<JsonSchemaType, JsonSchemaObject>(
			requiredLens,
			state.jsonSchema
		);

		if (!currentState.required) {
			currentState.required = new Array<string>();
		}

		const indexOfRequired = currentState.required.indexOf(propertyName);

		if (!newValue && indexOfRequired >= 0) {
			currentState.required.splice(indexOfRequired, 1);
		} else if (newValue && indexOfRequired === -1) {
			currentState.required.push(propertyName);
		}

		const newState = R.set(requiredLens, currentState, state.jsonSchema);

		return newState;
	},
};
