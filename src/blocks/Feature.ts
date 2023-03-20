import { Block } from 'payload/types';

const FeatureBlock: Block = {
    slug: 'feature',
    imageURL: 'https://fakeimg.pl/400x400',
    imageAltText: 'A nice thumbnail image to show what this block looks like',
    fields: [
        {
            name: 'content',
            type: 'richText',
            required: true,
            admin: {
                elements: [
                    'h2', 
                    'link',
                    'ul',
                    'ol'
                ],
            }
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: true,
            filterOptions: {
                mimeType: { contains: 'image' },
            },
        },
        {
            name: 'imagePosition',
            type: 'select',
            required: true,
            defaultValue: 'right',
            options: [
                {
                    label: 'Left',
                    value: 'left',
                },
                {
                    label: 'Right',
                    value: 'right',
                },
            ]
        }
    ]
};

export default FeatureBlock;