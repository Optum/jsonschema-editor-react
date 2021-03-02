import * as React from 'react'
import {ThemeProvider} from '@chakra-ui/core'

const DocsWrapper = (props: any): JSX.Element => {
	return <ThemeProvider>{props.children}</ThemeProvider>
}

export default DocsWrapper
