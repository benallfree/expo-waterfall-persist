import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'

const out = 'expo-waterfall-persist'
const external = ['expo', 'react-waterfall', 'lodash']

export default [
  {
    input: 'src/index.js',
    output: {
      file: `dist/${out}.min.js`,
      format: 'cjs'
    },
    plugins: [
      babel({ exclude: 'node_modules/**' }),
      uglify(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    ],
    external
  },
  {
    input: 'src/index.js',
    output: {
      file: `dist/${out}.dev.js`,
      format: 'cjs'
    },
    plugins: [
      babel({ exclude: 'node_modules/**' }),
      uglify(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    ],
    external
  }
]
