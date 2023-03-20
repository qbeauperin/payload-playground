import { CollectionConfig } from 'payload/types';

const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      localized: true,
    },
  ],
  timestamps: false,
}

export default Tags;