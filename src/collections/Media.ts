import path from 'path';
import type { CollectionConfig } from 'payload/types';

const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: path.resolve(__dirname, '../../media'),
    adminThumbnail: 'squareThumbnail',
    imageSizes: [
      {
        width: 400,
        height: 400,
        name: 'squareThumbnail',
        formatOptions: {
          format: "webp",
        },
      },
      {
        width: 720,
        name: 'thumbnail',
        formatOptions: {
          format: "webp",
        },
      },
      {
        width: 1920,
        height: 750,
        name: 'heroBanner',
        formatOptions: {
          format: "webp",
        },
      },
      {
        width: 1920,
        height: 750,
        name: 'heroBanner',
        formatOptions: {
          format: "webp",
        },
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
    },
  ],
};

export default Media;
