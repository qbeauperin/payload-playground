import { CollectionConfig } from 'payload/types';
import { publishedOrLoggedIn } from '../access/loggedInOrPublished';

const Tests: CollectionConfig = {
  slug: 'tests',
  admin: {
    group: '_',
    useAsTitle: 'title',
    // hideAPIURL: true,
  },
  access: {
    read: publishedOrLoggedIn
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
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Unnamed tab',
          fields: [
            {
              type: 'collapsible',
              label: ({ data }) => data?.localizedText || 'Untitled',
              fields: [
                {
                  name: 'localizedText',
                  type: 'text',
                  localized: true,
                  required: true,
                },
                {
                  name: 'nonLocalizedText',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'localizedExcerpt',
              type: 'textarea',
              localized: true,
              required: true,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'localizedTextarea',
                  type: 'textarea',
                  localized: true,
                  required: true,
                },
                {
                  name: 'nonLocalizedTextarea',
                  type: 'textarea',
                  required: true,
                },
              ],
            },
          ]
        },
        {
          label: 'Named tab',
          name: 'namedtab',
          fields: [
            {
              name: 'localizedRichText',
              type: 'richText',
              localized: true,
              required: true,
            },
            {
              name: 'nonLocalizedRichText',
              type: 'richText',
              required: true,
            },
          ]
        },
      ]
    },
    {
      type: 'group',
      name: 'group',
      fields: [
        {
          name: 'groupedLocalizedText',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'groupedNonLocalizedText',
          type: 'text',
          required: true,
        },
      ]
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'blockA',
          fields: [
            {
              name: 'localizedText',
              type: 'text',
              localized: true,
              required: true,
            },
            {
              name: 'nonLocalizedText',
              type: 'text',
              required: true,
            },
          ]
        },
        {
          slug: 'blockB',
          fields: [
            {
              name: 'localizedText',
              type: 'text',
              localized: true,
              required: true,
            },
            {
              name: 'nonLocalizedText',
              type: 'text',
              required: true,
            },
          ]
        }
      ]
    },
    {
      name: 'array',
      type: 'array',
      fields: [
        {
          name: 'localizedText',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'nonLocalizedText',
          type: 'text',
          required: true,
        },
      ]
    },
    {
      name: 'localizedArray',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'localizedText',
          type: 'text',
          required: true,
        },
        {
          name: 'localizedTextArea',
          type: 'text',
          required: true,
        },
      ]
    }
  ],
}

export default Tests;