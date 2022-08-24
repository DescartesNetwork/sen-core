require('dotenv-cra').config() // https://github.com/gsoft-inc/craco/issues/180

const {
  CracoTheme,
  CracoAppLessPlugin,
  CracoOsLessPlugin,
  CracoModuleFederation,
  CracoCompatibility,
  CracoWasm,
  CracoSilence,
  CracoAnalyzer,
  CracoAssetSenhub,
} = require('@sentre/craco-plugins')

module.exports = {
  plugins: [
    {
      plugin: CracoModuleFederation.enableHMR(),
      options: {
        uniqueName: process.env.REACT_APP_ID,
      },
    },
    // Os style loaders
    {
      plugin: CracoOsLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
            modifyVars: {
              '@ant-prefix': 'sentre',
            },
          },
        },
      },
    },
    // App style loaders
    {
      plugin: CracoAppLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
            modifyVars: {
              '@ant-prefix': process.env.REACT_APP_ID,
            },
          },
        },
      },
    },
    {
      plugin: CracoTheme,
      options: {
        theme: ['light', 'dark'],
        uniqueName: process.env.REACT_APP_ID,
      },
    },
    {
      plugin: CracoCompatibility,
    },
    {
      plugin: CracoWasm,
    },
    {
      plugin: CracoAssetSenhub,
      options: {
        outputFile: process.env.REACT_APP_ID + '-asset-senhub',
      },
    },
    {
      plugin: CracoSilence,
    },
    {
      plugin: CracoAnalyzer,
    },
  ],
}
