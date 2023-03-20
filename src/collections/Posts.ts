import { CollectionConfig } from 'payload/types';

const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    defaultColumns: ['title', 'author', 'category', 'tags', 'status'],
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      localized: true,
      required: true,
      unique: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      required: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      min: 1,
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'related',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      max: 3,
      admin: {
        position: 'sidebar',
      },
    },
  ]
}

export default Posts;