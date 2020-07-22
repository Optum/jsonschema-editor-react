import * as React from 'react'
import {Flex, FormLabel, Stack, Select} from '@chakra-ui/core'

import {SchemaContext} from '../model'
import {getDefaultSchema, DataType} from '../utils'
import {JsonSchemaType, JsonSchemaString} from '../json-schema.types'

export interface AdvancedBooleanProps {
    lens: string[]
}

export const AdvancedBoolean: React.FunctionComponent<AdvancedBooleanProps> = (
    props: React.PropsWithChildren<AdvancedBooleanProps>
) => {
    const {lens} = props

    return (
        <SchemaContext.Consumer>
            {schema => {
                const initial: JsonSchemaType = getDefaultSchema(
                    DataType.object,
                    schema.schemaRoot
                )
                const data = schema.getDataByLens
                    ? schema.getDataByLens(lens)
                    : initial
                return (
                    <Flex direction="column" wrap="nowrap">
                        <Stack
                            isInline
                            alignItems="center"
                            justifyContent="center"
                            alignContent="center"
                            m={1}
                        >
                            <FormLabel mr={2} htmlFor="default">
                                Default:{' '}
                            </FormLabel>
                            <Select
                                variant="outline"
                                value={(data as JsonSchemaString).default ?? ''}
                                size="sm"
                                margin={2}
                                placeholder="Choose data type"
                                onChange={(
                                    e: React.ChangeEvent<HTMLSelectElement>
                                ) => {
                                    if (schema.changeAdvancedProperty) {
                                        schema.changeAdvancedProperty(
                                            e.target.value,
                                            lens,
                                            'default'
                                        )
                                    }
                                }}
                            >
                                <option key="true" value="true">
                                    true
                                </option>
                                <option key="false" value="false">
                                    false
                                </option>
                            </Select>
                        </Stack>
                    </Flex>
                )
            }}
        </SchemaContext.Consumer>
    )
}
