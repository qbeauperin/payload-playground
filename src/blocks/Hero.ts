import { Block } from 'payload/types';

const HeroBlock: Block = {
    slug: 'hero',
    imageURL: 'https://fakeimg.pl/400x400',
    imageAltText: 'A nice thumbnail image to show what this block looks like',
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
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
            name: 'align',
            type: 'select',
            defaultValue: 'center',
            options: [
                {
                    label: 'Left',
                    value: 'left',
                },
                {
                    label: 'Center',
                    value: 'center',
                },
                {
                    label: 'Right',
                    value: 'right',
                },
            ]
        }
    ]
};

export default HeroBlock;