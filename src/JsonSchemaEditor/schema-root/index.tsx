import * as React from "react";
import {
	Flex,
	Input,
	Checkbox,
	FlexProps,
	Select,
	IconButton,
	Tooltip,
} from "@chakra-ui/react";
import { useState, State } from "@hookstate/core";
import { JSONSchema7, JSONSchema7TypeName } from "../../JsonSchemaEditor.types";
import { IoIosAddCircleOutline } from "react-icons/io";
import { getDefaultSchema, DataType, random, handleTypeChange } from "../utils";
export interface SchemaArrayProps extends FlexProps {
	schemaState: State<JSONSchema7>;
	onSchemaChange: (results: string) => void;
	isReadOnly: State<boolean>;
}
export const SchemaRoot: React.FunctionComponent<SchemaArrayProps> = (
	props: React.PropsWithChildren<SchemaArrayProps>
) => {
	const state = useState(props.schemaState);
	const isReadOnlyState = useState(props.isReadOnly);

	return (
		<>
			{props.onSchemaChange(JSON.stringify(state.value))}
			<Flex
				data-testid="jsonschema-editor"
				direction="row"
				wrap="nowrap"
				size="sm"
				mt={2}
				mr={5}
			>
				<Input isDisabled placeholder="root" margin={2} variant="outline" />
				<Tooltip
					hasArrow
					aria-label="All Required"
					label="All Required"
					placement="top"
				>
					<Checkbox
						isDisabled={isReadOnlyState.value}
						margin={2}
						width={20}
						colorScheme="blue"
					/>
				</Tooltip>

				<Select
					variant="outline"
					isDisabled={isReadOnlyState.value}
					value={state.type.value ?? ""}
					size="sm"
					margin={2}
					placeholder="Choose root data type"
					onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
						const newSchema = handleTypeChange(
							evt.target.value as JSONSchema7TypeName,
							false
						);
						state.set(newSchema as JSONSchema7);
					}}
				>
					<option key="object" value="object">
						object
					</option>
					<option key="array" value="array">
						array
					</option>
				</Select>
				<Input
					value={state.value?.title ?? ""}
					isDisabled={isReadOnlyState.value}
					size="sm"
					margin={2}
					variant="outline"
					placeholder="Add Title"
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						state.title.set(evt.target.value);
					}}
				/>
				<Input
					value={state.value?.description ?? ""}
					isDisabled={isReadOnlyState.value}
					size="sm"
					margin={2}
					variant="outline"
					placeholder="Add Description"
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						state.description.set(evt.target.value);
					}}
				/>

				{state.value?.type === "object" && (
					<>
						<Tooltip
							hasArrow
							aria-label="Add Child Node"
							label="Add Child Node"
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
								aria-label="Add Child Node"
								onClick={() => {
									const fieldName = `field_${random()}`;
									(state.properties as State<{
										[key: string]: JSONSchema7;
									}>)[fieldName].set(getDefaultSchema(DataType.string));
								}}
							/>
						</Tooltip>
					</>
				)}
			</Flex>
		</>
	);
};
