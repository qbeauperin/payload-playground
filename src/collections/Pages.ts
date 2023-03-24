import { CollectionConfig } from 'payload/types';

// SEO fields
import { Overview } from '@payloadcms/plugin-seo/dist/ui/Overview';
import { getMetaDescriptionField } from '@payloadcms/plugin-seo/dist/fields/MetaDescription';
import { getMetaTitleField } from '@payloadcms/plugin-seo/dist/fields/MetaTitle';
import { getPreviewField } from '@payloadcms/plugin-seo/dist/ui/Preview';
import { getMetaImageField } from '@payloadcms/plugin-seo/dist/fields/MetaImage';

// Blocks
import HeroBlock from '../blocks/Hero';
import FeatureBlock from '../blocks/Feature';
import GalleryBlock from '../blocks/Gallery';

// Access
import { publishedOrLoggedIn } from '../access/loggedInOrPublished';
import publishedDateField from '../fields/publishedDate';

const seoConfig = {
  uploadsCollection: 'media',
  generateTitle: ({ doc }) => `${doc?.title?.value} — Fae Farm`,
  generateDescription: ({ doc }) => doc?.excerpt?.value,
  generateURL: ({ doc }) => `https://faefarm.com/news/${doc?.slug?.value}`,
  generateImage: ({ doc }) => doc?.featuredImage?.value,
}

const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    group: 'Site',
    defaultColumns: ['title', 'author', 'category', 'tags', 'status'],
    useAsTitle: 'title',
    preview: (doc, { locale, token }) => {
      if (doc?.slug) {
        console.log(`User token for preview: ${token}`)
        return `https://localhost:3000/preview/pages/${doc.slug}?locale=${locale}`;
      }
      return null;
    },
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
          label: 'Settings',
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
          ]
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'content',
              type: 'blocks',
              minRows: 1,
              maxRows: 20,
              blocks: [
                HeroBlock, 
                FeatureBlock,
                GalleryBlock,
              ]
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
                  localized: true,
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
    publishedDateField,
  ]
}

export default Pages;