import * as React from "react";
import {
	Flex,
	Input,
	Checkbox,
	FlexProps,
	Select,
	IconButton,
	Tooltip,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from "@chakra-ui/react";
import { useState, State } from "@hookstate/core";
import { JSONSchema7, JSONSchema7TypeName } from "../../JsonSchemaEditor.types";
import { FiSettings } from "react-icons/fi";
import { IoIosAddCircleOutline } from "react-icons/io";
import {
	SchemaTypes,
	getDefaultSchema,
	DataType,
	handleTypeChange,
	random,
} from "../utils";

import { SchemaObject } from "../schema-object";
import { AdvancedSettings } from "../schema-advanced";
export interface SchemaArrayProps extends FlexProps {
	schemaState: State<JSONSchema7>;
	isReadOnly: State<boolean>;
}
export const SchemaArray: React.FunctionComponent<SchemaArrayProps> = (
	props: React.PropsWithChildren<SchemaArrayProps>
) => {
	const { schemaState, isReadOnly } = props;

	const state = useState(schemaState.items as JSONSchema7);
	const isReadOnlyState = useState(isReadOnly);

	const { length } = state.path.filter((name) => name !== "properties");
	const tagPaddingLeftStyle = {
		paddingLeft: `${20 * (length + 1)}px`,
	};

	const onCloseAdvanced = (): void => {
		localState.isAdvancedOpen.set(false);
	};

	const showadvanced = (): void => {
		localState.isAdvancedOpen.set(true);
	};

	const focusRef = React.createRef<HTMLElement>();

	const localState = useState({
		isAdvancedOpen: false,
	});

	return (
		<>
			<Flex
				direction="row"
				wrap="nowrap"
				className="array-item"
				mt={2}
				mr={5}
				style={tagPaddingLeftStyle}
			>
				<Input
					key="Items"
					isDisabled
					value="Items"
					size="sm"
					flexShrink={1}
					margin={2}
					variant="outline"
				/>
				<Checkbox isDisabled margin={2} colorScheme="blue" />
				<Select
					variant="outline"
					isDisabled={isReadOnlyState.value}
					value={state.type.value as JSONSchema7TypeName}
					size="sm"
					margin={2}
					placeholder="Choose data type"
					onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
						const newSchema = handleTypeChange(
							evt.target.value as JSONSchema7TypeName,
							false
						);
						state.set(newSchema as JSONSchema7);
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
					value={state.title.value}
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
					value={state.description.value}
					isDisabled={isReadOnlyState.value}
					size="sm"
					margin={2}
					variant="outline"
					placeholder="Add Description"
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						state.description.set(evt.target.value);
					}}
				/>
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
							showadvanced();
						}}
					/>
				</Tooltip>

				{state.type.value === "object" && (
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
				)}
			</Flex>
			{state.type?.value === "object" && (
				<SchemaObject isReadOnly={isReadOnlyState} schemaState={state} />
			)}
			{state.type?.value === "array" && (
				<SchemaArray isReadOnly={isReadOnlyState} schemaState={state} />
			)}
			<Modal
				isOpen={localState.isAdvancedOpen.get()}
				finalFocusRef={focusRef}
				size="lg"
				onClose={onCloseAdvanced}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader textAlign="center">Advanced Schema Settings</ModalHeader>

					<ModalBody>
						<AdvancedSettings itemStateProp={state} />
					</ModalBody>

					<ModalFooter>
						<Button
							colorScheme="blue"
							variant="ghost"
							mr={3}
							onClick={onCloseAdvanced}
						>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
