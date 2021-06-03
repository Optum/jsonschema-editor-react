import * as React from "react";
import { SchemaItem } from "../schema-item";
import {
	JSONSchema7,
	JSONSchema7Definition,
} from "../../JsonSchemaEditor.types";
import { useState, State } from "@hookstate/core";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import { AdvancedSettings } from "../schema-advanced";
export interface SchemaObjectProps {
	schemaState: State<JSONSchema7>;
	isReadOnly: State<boolean>;
}

export const SchemaObject: React.FunctionComponent<SchemaObjectProps> = (
	props: React.PropsWithChildren<SchemaObjectProps>
) => {
	const { schemaState, isReadOnly } = props;
	const schema = useState(schemaState);
	const properties = useState(schema.properties);

	const propertiesOrNull:
		| State<{
				[key: string]: JSONSchema7Definition;
		  }>
		| undefined = properties.ornull;

	const isReadOnlyState = useState(isReadOnly);

	const onCloseAdvanced = (): void => {
		localState.isAdvancedOpen.set(false);
	};

	const showadvanced = (item: string): void => {
		localState.isAdvancedOpen.set(true);
		localState.item.set(item);
	};

	const focusRef = React.createRef<HTMLElement>();

	const localState = useState({
		isAdvancedOpen: false,
		item: "",
	});

	if (!propertiesOrNull) {
		return <></>;
	} else {
		return (
			<div className="object-style">
				{propertiesOrNull?.keys?.map((name) => {
					return (
						<SchemaItem
							key={String(name)}
							itemStateProp={
								propertiesOrNull.nested(name as string) as State<JSONSchema7>
							}
							parentStateProp={schema}
							name={name as string}
							showadvanced={showadvanced}
							required={schema.required.value as string[]}
							isReadOnly={isReadOnlyState}
						/>
					);
				})}
				<Modal
					isOpen={localState.isAdvancedOpen.get()}
					finalFocusRef={focusRef}
					size="lg"
					onClose={onCloseAdvanced}
				>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader textAlign="center">
							Advanced Schema Settings
						</ModalHeader>

						<ModalBody>
							<AdvancedSettings
								itemStateProp={
									propertiesOrNull.nested(
										localState.item.value as string
									) as State<JSONSchema7>
								}
							/>
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
			</div>
		);
	}
};
