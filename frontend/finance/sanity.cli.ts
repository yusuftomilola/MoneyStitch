import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '48i41zxe',
    dataset: 'production',
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
    appId: 'iy4x0o80jbelr3dxidxhg9zl',
  },
})
