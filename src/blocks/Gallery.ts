import { Block } from 'payload/types';

const GalleryBlock: Block = {
    slug: 'gallery',
    imageURL: 'https://fakeimg.pl/400x400',
    imageAltText: 'A nice thumbnail image to show what this block looks like',
    fields: [
        {
            name: 'items',
            type: 'array',
            required: true,
            minRows: 1,
            maxRows: 20,
            labels: {
                singular: 'Item',
                plural: 'Items',
            },
            fields: [
                {
                    name: 'type',
                    type: 'select',
                    defaultValue: 'internal',
                    options: [
                        {
                            label: 'Internal asset',
                            value: 'internal',
                        },
                        {
                            label: 'Youtube video',
                            value: 'youtube',
                        },
                    ]
                },
                {
                    name: 'asset',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                    filterOptions: {
                        mimeType: { contains: 'image' },
                    },
                    admin: {
                        condition: (data, siblingData) => siblingData?.type === 'internal'
                    }
                },
                {
                    name: 'alt',
                    type: 'text',
                    required: true,
                    admin: {
                        condition: (data, siblingData) => siblingData?.type === 'internal',
                        description: "Short description of the image for accessibility.",
                    }
                },
                {
                    name: 'youtubeLink',
                    type: 'text',
                    required: true,
                    admin: {
                        condition: (data, siblingData) => siblingData?.type === 'youtube',
                        description: "Full youtube link, eg: https://www.youtube.com/watch?v=sNfXO59FRCU",
                    }
                },
                {
                    name: 'caption',
                    type: 'textarea',
                    admin: {
                        condition: (data, siblingData) => siblingData?.type === 'youtube',
                        description: "Text displayed underneath the image/video.",
                    }
                },
            ]
        },
    ]
};

export default GalleryBlock;