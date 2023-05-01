import { CollectionConfig } from 'payload/types';

// Access
import { publishedOrLoggedIn } from '../access/loggedInOrPublished';
import publishedDateField from '../fields/publishedDate';

const Tests: CollectionConfig = {
  slug: 'tests',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: publishedOrLoggedIn
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Unnamed tab',
          fields: [
            {
              type: 'collapsible',
              label: ({ data }) => data?.title || 'Untitled',
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
              ],
            },
            {
              name: 'excerpt',
              type: 'textarea',
              localized: true,
              required: true,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'tags',
                  type: 'relationship',
                  relationTo: 'tags',
                  hasMany: true,
                  min: 1,
                },
                {
                  name: 'related',
                  label: 'Related posts',
                  type: 'relationship',
                  relationTo: 'posts',
                  hasMany: true,
                  max: 3,
                  filterOptions: {
                    _status: { equals: 'published' }
                  },
                  admin: {
                    position: 'sidebar',
                  },
                },
              ],
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              filterOptions: {
                mimeType: { contains: 'image' },
              },
            },
            
            publishedDateField,
          ]
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'content',
              type: 'richText',
              localized: true,
            },
          ]
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              label: 'SEO',
              type: 'group',
              fields: [
                {
                  name: 'overview',
                  label: 'Overview',
                  type: 'ui',
                  admin: {
                    components: {
                      Field: Overview,
                    },
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                  admin: {
                    components: {
                      Field: (props) => getMetaTitleField({ ...props, ...{ pluginConfig: seoConfig } }),
                    },
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  localized: true,
                  admin: {
                    components: {
                      Field: (props) => getMetaDescriptionField({ ...props, ...{ pluginConfig: seoConfig } }),
                    },
                  },
                },
                {
                  name: 'image',
                  label: 'Meta Image',
                  type: 'upload',
                  relationTo: seoConfig?.uploadsCollection,
                  admin: {
                    description: 'Maximum upload file size: 12MB. Recommended file size for images is <500KB.',
                    components: {
                      Field: (props) => getMetaImageField({ ...props, ...{ pluginConfig: seoConfig } }),
                    },
                  },
                },
                {
                  name: 'preview',
                  label: 'Preview',
                  type: 'ui',
                  admin: {
                    components: {
                      Field: (props) => getPreviewField({ ...props, ...{ pluginConfig: seoConfig } }),
                    },
                  },
                },
              ]
            }
          ]
        }
      ]
    },
  ],
}

export default Posts;