import * as React from 'react'
import {
	Flex,
	Input,
	Checkbox,
	FlexProps,
	Select,
	Tooltip,
	IconButton,
	useToast
} from '@chakra-ui/core'
import {FiSettings} from 'react-icons/fi'
import {IoIosAddCircleOutline} from 'react-icons/io'
import {AiOutlineDelete} from 'react-icons/ai'
import {SchemaContext} from '../model'
import {SchemaTypes, PropertyType} from '../utils'
import {DropPlus} from '../drop-plus'
import {getComponent} from '../mapper'
import {JsonSchemaObject} from '../json-schema.types'
export interface SchemaItemProps extends FlexProps {
	data: JsonSchemaObject
	name: string
	lens: string[]
	showAdvanced: (lens: string[]) => void
}

export const SchemaItem: React.FunctionComponent<SchemaItemProps> = (
	props: React.PropsWithChildren<SchemaItemProps>
) => {
	const {name, data, lens, showAdvanced} = props

	const item = data.properties[name]
	const {length} = lens.filter(name => name !== 'properties')
	const tagPaddingLeftStyle = {
		paddingLeft: `${20 * (length + 1)}px`
	}
	const isRequired = data.required
		? data.required.length > 0 && data.required.includes(name)
		: false
	const toast = useToast()

	return (
		<SchemaContext.Consumer>
			{schema => (
				<>
					<Flex
						alignContent="space-evenly"
						direction="row"
						wrap="nowrap"
						className="schema-item"
						style={tagPaddingLeftStyle}
						{...props}
					>
						<Input
							isDisabled={schema.isReadOnly}
							value={name}
							size="sm"
							margin={2}
							variant="outline"
							placeholder="Outline"
							onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
								// Todo: make toast for duplicate properties
								if (data.properties[evt.target.value]) {
									toast({
										title: 'Duplicate Property',
										description: 'Property already exists!',
										status: 'error',
										duration: 1000,
										isClosable: true,
										position: 'top'
									})
								} else if (schema.handleNameChange) {
									schema.handleNameChange(evt.target.value, lens)
								}
							}}
						/>
						<Checkbox
							isDisabled={schema.isReadOnly}
							isChecked={isRequired}
							margin={2}
							variantColor="blue"
							onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
								if (schema.handleRequiredChange) {
									schema.handleRequiredChange(evt.target.checked, lens)
								}
							}}
						/>
						<Select
							isDisabled={schema.isReadOnly}
							variant="outline"
							value={item.type}
							size="sm"
							margin={2}
							placeholder="Choose data type"
							onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
								if (schema.handleTypeChange) {
									schema.handleTypeChange(evt.target.value, lens)
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
							isDisabled={schema.isReadOnly}
							value={item.title || ''}
							size="sm"
							margin={2}
							variant="outline"
							placeholder="Add Title"
							onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
								if (schema.handleTitleChange) {
									schema.handleTitleChange(evt.target.value, lens)
								}
							}}
						/>
						<Input
							isDisabled={schema.isReadOnly}
							value={item.description || ''}
							size="sm"
							margin={2}
							variant="outline"
							placeholder="Add Description"
							onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
								if (schema.handleDescriptionChange) {
									schema.handleDescriptionChange(evt.target.value, lens)
								}
							}}
						/>

						{item.type !== 'object' && item.type !== 'array' && (
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
						)}

						<Tooltip
							hasArrow
							aria-label="Remove Node"
							label="Remove Node"
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
								variantColor="red"
								fontSize="16px"
								icon={AiOutlineDelete}
								aria-label="Remove Node"
								onClick={() => {
									if (schema.deleteItem) {
										schema.deleteItem(lens)
									}
								}}
							/>
						</Tooltip>

						{item.type === 'object' ? (
							<DropPlus isDisabled={schema.isReadOnly!} lens={lens} />
						) : (
							<Tooltip
								hasArrow
								aria-label="Add Sibling Node"
								label="Add Sibling Node"
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
									aria-label="Add Sibling Node"
									onClick={() => {
										if (schema.addItem) {
											schema.addItem(lens, PropertyType.SIBLING)
										}
									}}
								/>
							</Tooltip>
						)}
					</Flex>
					{getComponent(item, lens, showAdvanced)}
				</>
			)}
		</SchemaContext.Consumer>
	)
}
