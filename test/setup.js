/* eslint-disable @typescript-eslint/no-var-requires */
const babelRegister = require('@babel/register')
const Enzyme = require('enzyme')
const EnzymeReactAdapter = require('enzyme-adapter-react-16')
/* eslint-enable @typescript-eslint/no-var-requires */

babelRegister({
    ignore: ['node_modules/*', 'test/*']
})

Enzyme.configure({
    adapter: new EnzymeReactAdapter()
})
