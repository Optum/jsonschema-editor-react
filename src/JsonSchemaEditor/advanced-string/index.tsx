import * as React from "react";
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
	Textarea,
	Select,
} from "@chakra-ui/react";
import {
	AdvancedItemStateProps,
	JSONSchema7,
} from "../../JsonSchemaEditor.types";
import { none, useState } from "@hookstate/core";
import { StringFormat } from "../utils";

export const AdvancedString: React.FunctionComponent<AdvancedItemStateProps> = (
	props: React.PropsWithChildren<AdvancedItemStateProps>
) => {
	const { itemStateProp } = props;

	const changeEnumOtherValue = (value: string): string[] | null => {
		const array = value.split("\n");
		if (array.length === 0 || (array.length === 1 && !array[0])) {
			return null;
		}

		return array;
	};

	const itemState = useState(itemStateProp);

	const isEnumChecked = (itemState.value as JSONSchema7).enum !== undefined;
	const enumData = (itemState.value as JSONSchema7).enum
		? (itemState.enum.value as string[])
		: [];
	const enumValue = enumData?.join("\n");

	return (
		<Flex direction="column" wrap="nowrap">
			<Stack
				isInline
				alignItems="center"
				justifyContent="center"
				alignContent="center"
				m={1}
			>
				<FormLabel mr={2}>Default: </FormLabel>
				<Input
					id="default"
					placeholder="Default value"
					value={(itemState.default.value as string) ?? ""}
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						itemState.default.set(evt.target.value);
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
				<FormLabel mr={2}>Min Length: </FormLabel>
				<NumberInput
					size="sm"
					defaultValue={Number(itemState.minLength.value)}
					onChange={(value: number | string) => {
						itemState.minLength.set(Number(value));
					}}
				>
					<NumberInputField value={Number(itemState.minLength.value)} />
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput>
				<FormLabel mr={2}>Max Length: </FormLabel>
				<NumberInput
					size="sm"
					defaultValue={Number(itemState.maxLength.value)}
					onChange={(value: number | string) => {
						itemState.maxLength.set(Number(value));
					}}
				>
					<NumberInputField value={Number(itemState.maxLength.value)} />
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
				<FormLabel mr={2} htmlFor="pattern">
					Pattern:{" "}
				</FormLabel>
				<Input
					id="pattern"
					placeholder="MUST be a valid regular expression."
					value={itemState.pattern.value ?? ""}
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						itemState.pattern.set(evt.target.value);
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
				<FormLabel mr={2}>Enum: </FormLabel>
				<Checkbox
					isChecked={isEnumChecked}
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						if (!evt.target.checked) {
							itemState.enum.set(none);
						} else {
							itemState.enum.set(Array<string>());
						}
					}}
				/>
				<Textarea
					value={enumValue || ""}
					isDisabled={!isEnumChecked}
					placeholder="ENUM Values - One Entry Per Line"
					onChange={(evt: React.ChangeEvent<HTMLTextAreaElement>) => {
						const update = changeEnumOtherValue(evt.target.value);
						if (update === null) {
							itemState.enum.set(none);
						} else {
							itemState.enum.set(update as string[]);
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
				<FormLabel mr={2} htmlFor="format">
					Format:{" "}
				</FormLabel>
				<Select
					variant="outline"
					value={itemState.format.value ?? ""}
					size="sm"
					margin={2}
					placeholder="Choose data type"
					onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
						if (evt.target.value === "") {
							itemState.format.set(none);
						} else {
							itemState.format.set(evt.target.value);
						}
					}}
				>
					{StringFormat.map((item, index) => {
						return (
							<option key={String(index)} value={item.name}>
								{item.name}
							</option>
						);
					})}
				</Select>
			</Stack>
		</Flex>
	);
};
