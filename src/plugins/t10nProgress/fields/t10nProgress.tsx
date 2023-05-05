import React from 'react';
import { JSONField } from 'payload/dist/fields/config/types';
import { useField } from 'payload/components/forms';
import { useConfig, useLocale } from "payload/components/utilities";
import { LocalizationConfig } from 'payload/dist/config/types';
import { Label } from 'payload/components/forms';
import { Props } from 'payload/components/fields/Json';
import { TranslationProgress } from '../types';
import LocalesProgress from '../components/LocalesProgress';
import ProgressBar from '../components/ProgressBar';
import ProgressBadge from '../components/ProgressBadge';

const T10nProgressFieldComponent: React.FC<Props> = (props: Props) => {
    const { path, label } = props;
    const locale = useLocale();
    const { localization } = useConfig();
    const { defaultLocale } = localization as LocalizationConfig;
    const { value } = useField<TranslationProgress>({ path })

    return locale === defaultLocale && value ? (
        <div className="t10Progress">
            <Label label={ label } />
            <LocalesProgress progress={value} defaultLocale={defaultLocale} />
        </div>
    ) : false;
};

const T10nProgressSummaryComponent: React.FC = ({ cellData }) => {
    if (!cellData) return;
    const locale = useLocale();
    const { localization } = useConfig();
    const { defaultLocale, locales } = localization as LocalizationConfig;
    const defaultLocaleCount = cellData[defaultLocale] ? cellData[defaultLocale] : 0;
    
    if (locale !== defaultLocale) {
        const localeCount = cellData[locale] ? cellData[locale] : 0;
        const progress = Math.round(localeCount / defaultLocaleCount * 100);
        const stringsRemaining = defaultLocaleCount - localeCount;
        const title = defaultLocaleCount ? (`${progress}%` + (progress < 100 ? ` - ${stringsRemaining} field missing` : '')) : 'No strings to translate';
        
        return (
            <ProgressBar progress={progress} title={title} />
        );
    } else {
        const localesBadges = locales.map((locale) => {
            if (locale === defaultLocale) return false;
            const localeCount = cellData[locale] ? cellData[locale] : 0;
            const progress = defaultLocaleCount ? Math.round(localeCount / defaultLocaleCount * 100) : 0;
            const stringsRemaining = defaultLocaleCount - localeCount;
            const title = defaultLocaleCount ? (`${progress}%` + (progress < 100 ? `- ${stringsRemaining} field missing` : '')) : 'No strings to translate';
            return (
                <li key={locale} style={{display: "inline-block"}}>
                    <ProgressBadge locale={locale} progress={progress} title={title} />
                </li>
            )
        });

        return (
            <ul style={{margin: 0, padding: 0, listStyle: "none"}}>
                {localesBadges}
            </ul>
        );
    }
};

const t10nProgressField: JSONField = {
    name: 't10nProgress',
    label: 'Translations',
    type: 'json',
    admin: {
        position: 'sidebar',
        components: {
            Field: T10nProgressFieldComponent,
            Cell: T10nProgressSummaryComponent,
        },
    }
};

export default t10nProgressField;