import { buildConfig } from 'payload/config';
import path from 'path';
import Posts from './collections/Posts';
import Tags from './collections/Tags';
import Pages from './collections/Pages';
import Users from './collections/Users';
import Media from './collections/Media';

export default buildConfig({
  serverURL: 'http://localhost:3000',
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
});
