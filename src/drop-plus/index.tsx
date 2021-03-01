import * as React from 'react'
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	Stack,
	FlexProps,
	IconButton,
	Button
} from '@chakra-ui/core'
import {IoIosAddCircleOutline} from 'react-icons/io'
import {SchemaContext} from '../model'
import {PropertyType} from '../utils'
export interface DropPlusProps extends FlexProps {
	lens: string[]
	isDisabled: boolean
}
export const DropPlus: React.FunctionComponent<DropPlusProps> = (
	props: React.PropsWithChildren<DropPlusProps>
) => {
	if (props.isDisabled) {
		return <div />
	}

	return (
		<SchemaContext.Consumer>
			{schema => (
				<Popover trigger="hover">
					<PopoverTrigger>
						<IconButton
							isRound
							size="sm"
							mt={2}
							mb={2}
							mr={2}
							variant="link"
							variantColor="green"
							fontSize="16px"
							icon={IoIosAddCircleOutline}
							aria-label="Add Child Node"
						/>
					</PopoverTrigger>

					<PopoverContent border="0" zIndex={4} width="100px" color="white">
						<Stack>
							<Button
								variantColor="blue"
								variant="outline"
								size="xs"
								onClick={() => {
									if (schema.addItem) {
										schema.addItem(props.lens, PropertyType.SIBLING)
									}
								}}
							>
								Sibling Node
							</Button>
							<Button
								size="xs"
								variantColor="orange"
								variant="outline"
								onClick={() => {
									if (schema.addItem) {
										schema.addItem(
											[...props.lens, 'properties'],
											PropertyType.CHILD
										)
									}
								}}
							>
								Child Node
							</Button>
						</Stack>
					</PopoverContent>
				</Popover>
			)}
		</SchemaContext.Consumer>
	)
}
