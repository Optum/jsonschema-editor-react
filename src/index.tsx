import * as React from 'react'
import {
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Button
} from '@chakra-ui/core'
import {SchemaProvider, SchemaContext} from './model'

import {SchemaRoot} from './schema-root'
import {getComponent} from './mapper'
import {AdvancedSettings} from './schema-advanced'
import {JsonSchemaType} from './json-schema.types'
import {Whoops} from './whoops'

interface SchemaEditorProps {
    /**
     * Text component
     */
    data?: JsonSchemaType | undefined
    schemaRoot: string
    onSchemaChange: (results: string) => void
    readOnly?: boolean
}

export * from './json-schema.types'

/**
 * Some documented component
 *
 */
const JsonSchemaEditor: React.FC<SchemaEditorProps> = (
    props: SchemaEditorProps
) => {
    const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false)
    const [currentLens, setCurrentLens] = React.useState(new Array<string>())

    const focusRef = React.createRef<HTMLElement>()

    const {onSchemaChange} = props
    const onCloseImport = (): void => {
        setIsAdvancedOpen(false)
    }

    const onCloseAdvanced = (): void => {
        setIsAdvancedOpen(false)
    }

    const showAdvanced = (lens: string[]): void => {
        setCurrentLens(lens)
        setIsAdvancedOpen(true)
    }

    return (
        <SchemaProvider
            schemaRoot={props.schemaRoot}
            readOnly={props.readOnly}
            data={props.data}
        >
            <SchemaContext.Consumer>
                {schema => (
                    <>
                        {onSchemaChange(JSON.stringify(schema.jsonSchema))}

                        {schema.isValidSchema ? (
                            <Flex m={2} direction="column">
                                <SchemaRoot
                                    readOnly={schema.isReadOnly}
                                    data={schema.jsonSchema}
                                />
                                {schema.jsonSchema &&
                                    getComponent(
                                        schema.jsonSchema,
                                        [],
                                        showAdvanced
                                    )}
                            </Flex>
                        ) : (
                            <Flex alignContent="center" justifyContent="center">
                                <Whoops />
                            </Flex>
                        )}
                        <Modal
                            isOpen={isAdvancedOpen}
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
                                    <AdvancedSettings lens={currentLens} />
                                </ModalBody>

                                <ModalFooter>
                                    <Button
                                        variantColor="blue"
                                        variant="ghost"
                                        mr={3}
                                        onClick={onCloseImport}
                                    >
                                        Close
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </>
                )}
            </SchemaContext.Consumer>
        </SchemaProvider>
    )
}

export default JsonSchemaEditor
