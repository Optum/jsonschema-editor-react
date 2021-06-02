import { JSONSchema7, JSONSchema7TypeName } from "../JsonSchemaEditor.types";
import * as React from "react";
import { useState } from "@hookstate/core";
import * as R from "ramda";

const schemaDraft = "http://json-schema.org/draft-07/schema#";

export const JSONPATH_JOIN_CHAR = ".";

export enum PropertyType {
	SIBLING,
	CHILD,
}

export function useDebounce<T>(value: T, delay?: number): T {
	const debouncedValue = useState<T>(value);

	React.useEffect(() => {
		const timer = setTimeout(() => debouncedValue.set(value), delay || 500);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue.value;
}

export default useDebounce;

export const StringFormat = [
	{ name: "date-time" },
	{ name: "date" },
	{ name: "time" },
	{ name: "email" },
	{ name: "hostname" },
	{ name: "ipv4" },
	{ name: "ipv6" },
	{ name: "uri" },
	{ name: "regex" },
];

export const SchemaTypes = [
	"string",
	"number",
	"array",
	"object",
	"boolean",
	"integer",
];

export enum DataType {
	string = "string",
	number = "number",
	array = "arrray",
	object = "object",
	boolean = "boolean",
	integer = "integer",
}

export const getDefaultSchema = (
	dataType: DataType,
	includeSchema?: boolean
): JSONSchema7 => {
	switch (dataType) {
		case DataType.number:
			return includeSchema
				? {
						$schema: schemaDraft,
						type: "number",
						title: "",
						description: "",
						properties: {},
				  }
				: {
						type: "number",
						title: "",
						description: "",
						properties: {},
				  };
		case DataType.boolean:
			return includeSchema
				? {
						$schema: schemaDraft,
						type: "boolean",
						title: "",
						description: "",
						properties: {},
				  }
				: {
						type: "boolean",
						title: "",
						description: "",
						properties: {},
				  };
		case DataType.integer:
			return includeSchema
				? {
						$schema: schemaDraft,
						type: "integer",
						title: "",
						description: "",
						properties: {},
				  }
				: {
						type: "integer",
						title: "",
						description: "",
						properties: {},
				  };
		case DataType.array:
			return includeSchema
				? {
						$schema: schemaDraft,
						type: "array",
						title: "",
						description: "",
						items: {
							type: "string",
							title: "",
							description: "",
						},
				  }
				: {
						type: "array",
						title: "",
						description: "",
						items: {
							type: "string",
							title: "",
							description: "",
						},
				  };
		case DataType.object:
			return includeSchema
				? {
						$schema: schemaDraft,
						type: "object",
						title: "",
						description: "",
						properties: {},
						required: [],
				  }
				: {
						type: "object",
						title: "",
						description: "",
						properties: {},
						required: [],
				  };
		case DataType.string:
		default:
			return includeSchema
				? {
						$schema: schemaDraft,
						type: "string",
						title: "",
						description: "",
						properties: {},
				  }
				: {
						type: "string",
						title: "",
						description: "",
						properties: {},
				  };
	}
};

export const random = () => {
	return Math.random().toString(36).substring(2, 6);
};

export const handleTypeChange = (
	newValue: JSONSchema7TypeName,
	rootChange: boolean
): JSONSchema7 => {
	switch (newValue) {
		case "array":
			return getDefaultSchema(DataType.array, rootChange) as JSONSchema7;
		case "object":
			return getDefaultSchema(DataType.object, rootChange) as JSONSchema7;
		default:
			return getDefaultSchema(
				(DataType as any)[newValue],
				rootChange
			) as JSONSchema7;
	}
};

export const renameKeys = R.curry(
	(keysMap: Record<string, string>, object: any) =>
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

export const deleteKey = (key: string, object: any) => {
	delete object[key];
	return object;
};
