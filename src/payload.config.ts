import { buildConfig } from 'payload/config';
import { gcsAdapter } from '@payloadcms/plugin-cloud-storage/gcs';
import { cloudStorage } from '@payloadcms/plugin-cloud-storage';
import path from 'path';
import Posts from './collections/Posts';
import Tags from './collections/Tags';
import Pages from './collections/Pages';
import Users from './collections/Users';
import Media from './collections/Media';
import Tests from './collections/Tests';
import MainMenu from './globals/MainMenu';
import { t10nProgress } from './plugins/t10nProgress';

const credentials = process.env.GCS_CREDENTIALS
  ? JSON.parse(Buffer.from(process.env.GCS_CREDENTIALS, 'base64').toString('ascii'))
  : null

const adapter = process.env.GCS_BUCKET
  ? gcsAdapter({
    options: {
      credentials: credentials,
    },
    bucket: process.env.GCS_BUCKET,
  })
  : null

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
    Tests,
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
      'de',
      'jp',
      'pt_BR',
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
    t10nProgress(),
  ]
});
