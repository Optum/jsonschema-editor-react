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
// import {FiSettings} from 'react-icons/fi'
import {IoIosAddCircleOutline} from 'react-icons/io'
import {SchemaContext} from '../model'
import {PropertyType} from '../utils'
import {JsonSchemaType} from '../json-schema.types'
export interface SchemaArrayProps extends FlexProps {
	data: JsonSchemaType | undefined
	readOnly?: boolean
}
export const SchemaRoot: React.FunctionComponent<SchemaArrayProps> = (
	props: React.PropsWithChildren<SchemaArrayProps>
) => {
	const {data, readOnly} = props

	return (
		<SchemaContext.Consumer>
			{(schema) => (
				<Flex direction="row" wrap="nowrap" mt={2} mr={5} {...props}>
					<Input
						isDisabled
						value="root"
						size="sm"
						margin={2}
						variant="outline"
					/>
					<Tooltip
						hasArrow
						aria-label="All Required"
						label="All Required"
						placement="top"
					>
						<Checkbox isDisabled={readOnly} margin={2} variantColor="blue" />
					</Tooltip>

					<Select
						variant="outline"
						isDisabled={readOnly}
						value={data?.type ?? ''}
						size="sm"
						margin={2}
						placeholder="Choose root data type"
						onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
							if (schema.handleTypeChange) {
								schema.handleTypeChange(evt.target.value, [])
							}
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
						value={data?.title ?? ''}
						isDisabled={readOnly}
						size="sm"
						margin={2}
						variant="outline"
						placeholder="Add Title"
						onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
							if (schema.handleTitleChange) {
								schema.handleTitleChange(evt.target.value, [])
							}
						}}
					/>
					<Input
						value={data?.description ?? ''}
						isDisabled={readOnly}
						size="sm"
						margin={2}
						variant="outline"
						placeholder="Add Description"
						onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
							if (schema.handleDescriptionChange) {
								schema.handleDescriptionChange(evt.target.value, [])
							}
						}}
					/>
					{/* <Tooltip
                        hasArrow
                        aria-label="Advanced Settings"
                        label="Advanced Settings"
                        placement="top"
                    >
                        <IconButton
                            isRound
                            size="sm"
                            mt={2}
                            mb={2}
                            ml={1}
                            variant="link"
                            variantColor="blue"
                            fontSize="16px"
                            icon={FiSettings}
                            aria-label="Advanced Settings"
                        />
                    </Tooltip> */}

					{data?.type === 'object' && (
						<Tooltip
							hasArrow
							aria-label="Add Child Node"
							label="Add Child Node"
							placement="top"
						>
							<IconButton
								isRound
								isDisabled={readOnly}
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
										schema.addItem(['properties'], PropertyType.CHILD)
									}
								}}
							/>
						</Tooltip>
					)}
				</Flex>
			)}
		</SchemaContext.Consumer>
	)
}
