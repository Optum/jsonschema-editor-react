import * as React from 'react'
import {
    Flex,
    Input,
    Checkbox,
    FlexProps,
    Select,
    IconButton,
    Tooltip
} from '@chakra-ui/core'
import {FiSettings} from 'react-icons/fi'
import {IoIosAddCircleOutline} from 'react-icons/io'
import {SchemaContext} from '../model'
import {SchemaTypes, PropertyType} from '../utils'
import {getComponent} from '../mapper'
import {JsonSchemaArray} from '../json-schema.types'
export interface SchemaArrayProps extends FlexProps {
    data: JsonSchemaArray
    lens: string[]
    showAdvanced: (lens: string[]) => void
}
export const SchemaArray: React.FunctionComponent<SchemaArrayProps> = (
    props: React.PropsWithChildren<SchemaArrayProps>
) => {
    const {data, lens, showAdvanced} = props

    const {items} = data

    const {length} = lens.filter(name => name !== 'properties')
    const tagPaddingLeftStyle = {
        paddingLeft: `${20 * (length + 1)}px`
    }

    return (
        <SchemaContext.Consumer>
            {schema => (
                <>
                    <Flex
                        direction="row"
                        wrap="nowrap"
                        className="array-item"
                        mt={2}
                        mr={5}
                        style={tagPaddingLeftStyle}
                        {...props}
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
                        <Checkbox isDisabled margin={2} variantColor="blue" />
                        <Select
                            variant="outline"
                            isDisabled={schema.isReadOnly}
                            value={items.type}
                            size="sm"
                            margin={2}
                            placeholder="Choose data type"
                            onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>
                            ) => {
                                if (schema.handleTypeChange) {
                                    schema.handleTypeChange(
                                        e.target.value,
                                        lens
                                    )
                                }
                            }}
                        >
                            {SchemaTypes.map((item, index) => {
                                return (
                                    <option key={String(index)} value={item}>
                                        {item}
                                    </option>
                                )
                            })}
                        </Select>
                        <Input
                            value={items.title || ''}
                            isDisabled={schema.isReadOnly}
                            size="sm"
                            margin={2}
                            variant="outline"
                            placeholder="Add Title"
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                if (schema.handleTitleChange) {
                                    schema.handleTitleChange(
                                        e.target.value,
                                        name
                                    )
                                }
                            }}
                        />
                        <Input
                            value={items.description || ''}
                            isDisabled={schema.isReadOnly}
                            size="sm"
                            margin={2}
                            variant="outline"
                            placeholder="Add Description"
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                if (schema.handleDescriptionChange) {
                                    schema.handleDescriptionChange(
                                        e.target.value,
                                        name
                                    )
                                }
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
                                isDisabled={schema.isReadOnly}
                                size="sm"
                                mt={2}
                                mb={2}
                                ml={1}
                                variant="link"
                                variantColor="blue"
                                fontSize="16px"
                                icon={FiSettings}
                                aria-label="Advanced Settings"
                                onClick={() => {
                                    props.showAdvanced(lens)
                                }}
                            />
                        </Tooltip>

                        {items.type === 'object' && (
                            <Tooltip
                                hasArrow
                                aria-label="Add Child Node"
                                label="Add Child Node"
                                placement="top"
                            >
                                <IconButton
                                    isRound
                                    isDisabled={schema.isReadOnly}
                                    size="sm"
                                    mt={2}
                                    mb={2}
                                    mr={2}
                                    variant="link"
                                    variantColor="green"
                                    fontSize="16px"
                                    icon={IoIosAddCircleOutline}
                                    aria-label="Add Child Node"
                                    onClick={() => {
                                        if (schema.addItem) {
                                            schema.addItem(
                                                lens.concat('properties'),
                                                PropertyType.CHILD
                                            )
                                        }
                                    }}
                                />
                            </Tooltip>
                        )}
                    </Flex>
                    {getComponent(items, lens, showAdvanced)}
                </>
            )}
        </SchemaContext.Consumer>
    )
}
