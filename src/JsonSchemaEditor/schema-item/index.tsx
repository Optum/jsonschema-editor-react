import * as React from "react";
import {
	Flex,
	Input,
	Checkbox,
	FlexProps,
	Select,
	Tooltip,
	IconButton,
	useToast,
} from "@chakra-ui/react";
import { FiSettings } from "react-icons/fi";
import { IoIosAddCircleOutline } from "react-icons/io";
import { AiOutlineDelete } from "react-icons/ai";
import { DropPlus } from "../drop-plus";
import { useState, State, none } from "@hookstate/core";
import {
	JSONSchema7,
	JSONSchema7Definition,
	JSONSchema7TypeName,
} from "../../JsonSchemaEditor.types";
import {
	getDefaultSchema,
	DataType,
	SchemaTypes,
	random,
	handleTypeChange,
} from "../utils";
import { renameKeys, deleteKey } from "../utils";
import { useDebouncedCallback } from "use-debounce";
import { SchemaObject } from "../schema-object";
import { SchemaArray } from "../schema-array";

export interface SchemaItemProps extends FlexProps {
	required: string[];
	itemStateProp: State<JSONSchema7>;
	parentStateProp: State<JSONSchema7>;
	name: string;
	isReadOnly: State<boolean>;
	showadvanced: (item: string) => void;
}

export const SchemaItem: React.FunctionComponent<SchemaItemProps> = (
	props: React.PropsWithChildren<SchemaItemProps>
) => {
	const {
		name,
		itemStateProp,
		showadvanced,
		required,
		parentStateProp,
		isReadOnly,
	} = props;

	// const itemState = useState(itemStateProp);
	const parentState = useState(parentStateProp);
	const parentStateOrNull: State<JSONSchema7> | undefined = parentState.ornull;
	const propertiesOrNull:
		| State<{
				[key: string]: JSONSchema7Definition;
		  }>
		| undefined = parentStateOrNull.properties.ornull;

	const nameState = useState(name);
	const isReadOnlyState = useState(isReadOnly);

	const itemState = useState(
		(parentStateProp.properties as State<{
			[key: string]: JSONSchema7;
		}>).nested(nameState.value)
	);

	const { length } = parentState.path.filter((name) => name !== "properties");
	const tagPaddingLeftStyle = {
		paddingLeft: `${20 * (length + 1)}px`,
	};

	const isRequired = required
		? required.length > 0 && required.includes(name)
		: false;
	const toast = useToast();

	// Debounce callback
	const debounced = useDebouncedCallback(
		// function
		(newValue: string) => {
			// Todo: make toast for duplicate properties
			if (propertiesOrNull && propertiesOrNull[newValue].value) {
				toast({
					title: "Duplicate Property",
					description: "Property already exists!",
					status: "error",
					duration: 1000,
					isClosable: true,
					position: "top",
				});
			} else {
				const oldName = name;
				const proptoupdate = newValue;

				const newobj = renameKeys(
					{ [oldName]: proptoupdate },
					parentState.properties.value
				);
				parentStateOrNull.properties.set(JSON.parse(JSON.stringify(newobj)));
			}
		},
		// delay in ms
		1000
	);

	if (!itemState.value) {
		return <></>;
	}

	return (
		<div>
			<Flex
				alignContent="space-evenly"
				direction="row"
				wrap="nowrap"
				className="schema-item"
				style={tagPaddingLeftStyle}
			>
				<Input
					isDisabled={isReadOnlyState.value}
					defaultValue={nameState.value}
					size="sm"
					margin={2}
					variant="outline"
					placeholder="Enter property name"
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						debounced(evt.target.value);
					}}
				/>
				<Checkbox
					isDisabled={isReadOnlyState.value}
					isChecked={isRequired}
					margin={2}
					colorScheme="blue"
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						if (!evt.target.checked && required.includes(name)) {
							(parentState.required as State<string[]>)[
								required.indexOf(name)
							].set(none);
						} else {
							parentState.required.merge([name]);
						}
					}}
				/>
				<Select
					isDisabled={false}
					variant="outline"
					value={itemState.type.value}
					size="sm"
					margin={2}
					placeholder="Choose data type"
					onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
						const newSchema = handleTypeChange(
							evt.target.value as JSONSchema7TypeName,
							false
						);
						itemState.set(newSchema as JSONSchema7);
					}}
				>
					{SchemaTypes.map((item, index) => {
						return (
							<option key={String(index)} value={item}>
								{item}
							</option>
						);
					})}
				</Select>
				<Input
					isDisabled={isReadOnlyState.value}
					value={itemState.title.value || ""}
					size="sm"
					margin={2}
					variant="outline"
					placeholder="Add Title"
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						itemState.title.set(evt.target.value);
					}}
				/>
				<Input
					isDisabled={isReadOnlyState.value}
					value={itemState.description.value || ""}
					size="sm"
					margin={2}
					variant="outline"
					placeholder="Add Description"
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						itemState.description.set(evt.target.value);
					}}
				/>

				{itemState.type.value !== "object" && itemState.type.value !== "array" && (
					<Tooltip
						hasArrow
						aria-label="Advanced Settings"
						label="Advanced Settings"
						placement="top"
					>
						<IconButton
							isRound
							isDisabled={isReadOnlyState.value}
							size="sm"
							mt={2}
							mb={2}
							ml={1}
							variant="link"
							colorScheme="blue"
							fontSize="16px"
							icon={<FiSettings />}
							aria-label="Advanced Settings"
							onClick={() => {
								showadvanced(name);
							}}
						/>
					</Tooltip>
				)}

				<Tooltip
					hasArrow
					aria-label="Remove Node"
					label="Remove Node"
					placement="top"
				>
					<IconButton
						isRound
						isDisabled={isReadOnlyState.value}
						size="sm"
						mt={2}
						mb={2}
						ml={1}
						variant="link"
						colorScheme="red"
						fontSize="16px"
						icon={<AiOutlineDelete />}
						aria-label="Remove Node"
						onClick={() => {
							const updatedState = deleteKey(
								nameState.value,
								JSON.parse(JSON.stringify(parentState.properties.value))
							);
							parentState.properties.set(updatedState);
						}}
					/>
				</Tooltip>

				{itemState.type?.value === "object" ? (
					<DropPlus
						isDisabled={isReadOnlyState.value}
						parentStateProp={parentState}
						itemStateProp={itemStateProp}
					/>
				) : (
					<Tooltip
						hasArrow
						aria-label="Add Sibling Node"
						label="Add Sibling Node"
						placement="top"
					>
						<IconButton
							isRound
							isDisabled={isReadOnlyState.value}
							size="sm"
							mt={2}
							mb={2}
							mr={2}
							variant="link"
							colorScheme="green"
							fontSize="16px"
							icon={<IoIosAddCircleOutline />}
							aria-label="Add Sibling Node"
							onClick={() => {
								if (propertiesOrNull) {
									const fieldName = `field_${random()}`;
									propertiesOrNull
										?.nested(fieldName)
										.set(getDefaultSchema(DataType.string) as JSONSchema7);
								}
							}}
						/>
					</Tooltip>
				)}
			</Flex>
			{itemState.type?.value === "object" && (
				<SchemaObject isReadOnly={isReadOnlyState} schemaState={itemState} />
			)}
			{itemState.type?.value === "array" && (
				<SchemaArray isReadOnly={isReadOnlyState} schemaState={itemState} />
			)}
		</div>
	);
};
