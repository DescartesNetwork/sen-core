/**
 * This file is compulsory to let webpack to build the source into Module Federation standard.
 * References: https://webpack.js.org/concepts/module-federation/#troubleshooting
 */

import { render } from 'react-dom'

import Senhub from '@sentre/senhub'
import reportWebVitals from 'reportWebVitals'

render(<Senhub />, document.getElementById('root'))

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
