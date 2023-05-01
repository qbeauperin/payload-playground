import React, { useState } from 'react';
import { Field } from 'payload/types';
import LocalesProgressSummary from '../components/LocalesProgressSummary';
import LocalesProgress from '../components/LocalesProgress';
import { LocalizationConfig } from 'payload/dist/config/types';
import { useConfig, useLocale } from "payload/components/utilities";
import { Label } from 'payload/components/forms';
import { Props } from 'payload/components/fields/Text';

const T10nProgressUIField: React.FC<Props> = (props: Props) => {
    const { label } = props;
    const locale = useLocale();
    const { localization } = useConfig();
    const { locales, defaultLocale } = localization as LocalizationConfig;
    const defaultProgress = locales.reduce((acc, locale) => {
        acc[locale] = 0;
        return acc;
    }, {});
    const [progress, setProgress] = useState(defaultProgress);

    return locale === defaultLocale ? (
        <>
            <Label label={ label } />
            <LocalesProgress { ...{ progress, defaultLocale } } />
        </>
    ) : false;
};

const t10nProgressUI: Field = {
    name: 'translator',
    label: 'Translations',
    type: 'ui',
    admin: {
        position: 'sidebar',
        components: {
            Field: T10nProgressUIField,
            Cell: LocalesProgressSummary,
        },
    }
};

export default t10nProgressUI;