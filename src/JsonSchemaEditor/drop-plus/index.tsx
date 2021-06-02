import * as React from "react";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	Stack,
	FlexProps,
	IconButton,
	Button,
} from "@chakra-ui/react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { DataType, getDefaultSchema } from "../utils";
import { State, useState } from "@hookstate/core";
import {
	JSONSchema7,
	JSONSchema7Definition,
} from "../../JsonSchemaEditor.types";
import { random } from "../utils";
export interface DropPlusProps extends FlexProps {
	itemStateProp: State<JSONSchema7>;
	parentStateProp: State<JSONSchema7>;
	isDisabled: boolean;
}
export const DropPlus: React.FunctionComponent<DropPlusProps> = (
	props: React.PropsWithChildren<DropPlusProps>
) => {
	const itemState = useState(props.itemStateProp);
	const parentState = useState(props.parentStateProp);
	const parentStateOrNull: State<JSONSchema7> | undefined = parentState.ornull;
	const propertiesOrNull:
		| State<{
				[key: string]: JSONSchema7Definition;
		  }>
		| undefined = parentStateOrNull.properties.ornull;

	const itemPropertiesOrNull:
		| State<{
				[key: string]: JSONSchema7Definition;
		  }>
		| undefined = itemState.properties.ornull;

	if (props.isDisabled) {
		return <div />;
	}

	if (!parentStateOrNull) {
		return <></>;
	}

	return (
		<Popover trigger="hover">
			<PopoverTrigger>
				<IconButton
					isRound
					size="sm"
					mt={2}
					mb={2}
					mr={2}
					variant="link"
					colorScheme="green"
					fontSize="16px"
					icon={<IoIosAddCircleOutline />}
					aria-label="Add Child Node"
				/>
			</PopoverTrigger>

			<PopoverContent border="0" zIndex={4} width="100px" color="white">
				<Stack>
					<Button
						colorScheme="blue"
						variant="outline"
						size="xs"
						onClick={() => {
							const fieldName = `field_${random()}`;
							propertiesOrNull
								?.nested(fieldName)
								.set(getDefaultSchema(DataType.string) as JSONSchema7);
						}}
					>
						Sibling Node
					</Button>
					<Button
						size="xs"
						colorScheme="orange"
						variant="outline"
						onClick={() => {
							if (itemState.properties) {
								const fieldName = `field_${random()}`;
								itemPropertiesOrNull
									?.nested(fieldName)
									.set(getDefaultSchema(DataType.string) as JSONSchema7);
							}
						}}
					>
						Child Node
					</Button>
				</Stack>
			</PopoverContent>
		</Popover>
	);
};
