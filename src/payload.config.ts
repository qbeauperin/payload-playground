import { buildConfig } from 'payload/config';
import { gcsAdapter } from '@payloadcms/plugin-cloud-storage/gcs';
import { cloudStorage } from '@payloadcms/plugin-cloud-storage';
import path from 'path';
import Posts from './collections/Posts';
import Tags from './collections/Tags';
import Pages from './collections/Pages';
import Users from './collections/Users';
import Media from './collections/Media';
import MainMenu from './globals/MainMenu';
import { collaboration } from './plugins/collaboration';

const adapter = gcsAdapter({
  options: {
    keyFilename: './gcs-credentials.json',
  },
  bucket: process.env.GCS_BUCKET,
})

export default buildConfig({
  serverURL: process.env.SERVER_URL,
  admin: {
    user: Users.slug,
  },
  collections: [
    Posts,
    Tags,
    Pages,
    Users,
    Media,
  ],
  globals: [
    MainMenu,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts')
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  localization: {
    locales: [
      'en',
      'fr',
      'zh_hans',
      'zh_hant',
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  plugins: [
    cloudStorage({
      collections: {
        'media': {
          adapter: adapter,
          disablePayloadAccessControl: true,
          prefix: 'media',
        },
      },
    }),
    collaboration({
      collections: [ 'posts', 'pages' ],
      users: {
        collection: 'users',
        displayField: 'name',
      },
    }),
  ]
});
