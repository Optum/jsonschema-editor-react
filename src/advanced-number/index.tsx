import * as React from 'react'
import {
    Flex,
    Input,
    FormLabel,
    Stack,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Checkbox,
    Textarea
} from '@chakra-ui/core'

import {SchemaContext} from '../model'
import {getDefaultSchema, DataType} from '../utils'
import {
    JsonSchemaType,
    JsonSchemaRange,
    JsonSchemaEnum
} from '../json-schema.types'
export interface SchemaObjectProps {
    lens: string[]
}

export const AdvancedNumber: React.FunctionComponent<SchemaObjectProps> = (
    props: React.PropsWithChildren<SchemaObjectProps>
) => {
    const {lens} = props

    const onChangeCheckBox = (
        checked: boolean,
        callback:
            | ((newValue: string[] | null, lens: string[]) => void)
            | undefined
    ): void => {
        if (callback) {
            const newState = checked ? new Array<string>() : null
            callback(newState, lens)
        }
    }

    const changeEnumOtherValue = (
        value: string,
        callback:
            | ((newValue: string[] | null, lens: string[]) => void)
            | undefined
    ): void => {
        const arr = value.split('\n')
        if (arr.length === 0 || (arr.length === 1 && !arr[0])) {
            if (callback) {
                callback(null, lens)
            }
        } else if (callback) {
            callback(arr, lens)
        }
    }

    return (
        <SchemaContext.Consumer>
            {schema => {
                const initial: JsonSchemaType = getDefaultSchema(
                    DataType.number,
                    schema.schemaRoot
                )
                const data = schema.getDataByLens
                    ? schema.getDataByLens(lens)
                    : initial
                const isEnumChecked =
                    (data as JsonSchemaEnum).enum !== undefined
                const enumData = data as JsonSchemaEnum
                const enumValue = enumData?.enum?.join('\n')
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
                            <Input
                                id="default"
                                placeholder="Default value"
                                value={data.default ?? ''}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    if (schema.changeAdvancedProperty) {
                                        schema.changeAdvancedProperty(
                                            e.target.value,
                                            lens,
                                            'default'
                                        )
                                    }
                                }}
                            />
                        </Stack>

                        <Stack
                            isInline
                            alignItems="center"
                            justifyContent="center"
                            alignContent="center"
                            m={1}
                        >
                            <FormLabel mr={2} htmlFor="default">
                                Min Value:{' '}
                            </FormLabel>
                            <NumberInput
                                size="sm"
                                onChange={(value: number | string) => {
                                    if (schema.changeAdvancedProperty) {
                                        schema.changeAdvancedProperty(
                                            String(value),
                                            lens,
                                            'minimum'
                                        )
                                    }
                                }}
                            >
                                <NumberInputField
                                    value={(data as JsonSchemaRange).minimum}
                                />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <FormLabel mr={2} htmlFor="default">
                                Max Value:{' '}
                            </FormLabel>
                            <NumberInput
                                size="sm"
                                onChange={(value: number | string) => {
                                    if (schema.changeAdvancedProperty) {
                                        schema.changeAdvancedProperty(
                                            value as number,
                                            lens,
                                            'maximum'
                                        )
                                    }
                                }}
                            >
                                <NumberInputField
                                    value={(data as JsonSchemaRange).maximum}
                                />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </Stack>
                        <Stack
                            isInline
                            alignItems="center"
                            justifyContent="center"
                            alignContent="center"
                            m={1}
                        >
                            <FormLabel mr={2} htmlFor="default">
                                Enum:{' '}
                            </FormLabel>
                            <Checkbox
                                isChecked={isEnumChecked}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    onChangeCheckBox(
                                        e.target.checked,
                                        schema.changeEnum
                                    )
                                }}
                            />
                            <Textarea
                                value={enumValue || ''}
                                isDisabled={!isEnumChecked}
                                placeholder="ENUM Values - One Entry Per Line"
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    changeEnumOtherValue(
                                        e.target.value,
                                        schema.changeEnum
                                    )
                                }}
                            />
                        </Stack>
                    </Flex>
                )
            }}
        </SchemaContext.Consumer>
    )
}
