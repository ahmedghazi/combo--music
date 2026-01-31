import {defineConfig, isDev} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {media} from 'sanity-plugin-media'
import {structure} from './src/deskStructure'
import {resolveProductionUrl} from './src/actions/resolveProductionUrl'
import {getStartedPlugin} from './plugins/sanity-plugin-tutorial'
import {defaultDocumentNode} from './src/defaultDocumentNode'
import {presentationTool} from 'sanity/presentation'
import {linkResolver} from './src/linkResolver'

const devOnlyPlugins = [getStartedPlugin()]
const remoteURL = 'https://combo-music.vercel.app'
const localURL = 'http://localhost:3000'
const previewURL = window.location.hostname === 'localhost' ? localURL : remoteURL

export default defineConfig({
  name: 'default',
  title: 'Combo Music',

  projectId: 'pw3w9l4z',
  dataset: 'production',

  plugins: [
    structureTool({defaultDocumentNode, structure}),
    visionTool(),
    ...(isDev ? devOnlyPlugins : []),
    media(),
    presentationTool({
      resolve: linkResolver,
      previewUrl: {
        origin: previewURL,
        previewMode: {
          enable: '/api/preview',
          disable: '/api/exit-preview',
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // productionUrl: resolveProductionUrl,
    actions: [resolveProductionUrl],
  },
})
