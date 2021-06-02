import * as React from "react";
import { useState } from "@hookstate/core";
import { useSchemaState, defaultSchema } from "./state";
import { SchemaEditorProps } from "../JsonSchemaEditor.types";
import { Flex, ChakraProvider, theme } from "@chakra-ui/react";

import { SchemaRoot } from "./schema-root";
import { Whoops } from "./whoops";
import { SchemaObject } from "./schema-object";
import { SchemaArray } from "./schema-array";

export * from "../JsonSchemaEditor.types";

export const JsonSchemaEditor = (props: SchemaEditorProps) => {
	const { onSchemaChange, readOnly, data } = props;

	const schemaState = useSchemaState({
		jsonSchema: data ?? defaultSchema(),
		isReadOnly: readOnly ?? false,
		fieldId: 0,
	});

	const jsonSchemaState = useState(schemaState.jsonSchema);

	return (
		<ChakraProvider theme={theme}>
			{schemaState.isValidSchema ? (
				<Flex m={2} direction="column">
					<SchemaRoot
						onSchemaChange={onSchemaChange}
						schemaState={schemaState.jsonSchema}
						isReadOnly={schemaState.isReadOnly}
					/>

					{jsonSchemaState.type.value === "object" && (
						<SchemaObject
							schemaState={jsonSchemaState}
							isReadOnly={schemaState.isReadOnly ?? false}
						/>
					)}

					{jsonSchemaState.type.value === "array" && (
						<SchemaArray
							schemaState={jsonSchemaState}
							isReadOnly={schemaState.isReadOnly ?? false}
						/>
					)}
				</Flex>
			) : (
				<Flex alignContent="center" justifyContent="center">
					<Whoops />
				</Flex>
			)}
			{/* <Modal
        isOpen={localState.isAdvancedOpen.get()}
        finalFocusRef={focusRef}
        size="lg"
        onClose={onCloseAdvanced}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Advanced Schema Settings</ModalHeader>

          <ModalBody>
            <AdvancedSettings itemStateProp={localState.currentItem} />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              variant="ghost"
              mr={3}
              onClick={onCloseImport}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
		</ChakraProvider>
	);
};
