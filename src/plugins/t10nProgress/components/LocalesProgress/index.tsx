import React, { useState, useEffect } from 'react';
import { Chevron } from 'payload/components/icons';
import { usePreferences } from 'payload/components/preferences';
import ProgressBar from '../ProgressBar';
import './styles.scss';

const LocaleProgress: React.FC = ({locale, localeCount, defaultLocaleCount}) => {
    const progress = Math.round(localeCount / defaultLocaleCount * 100);
    const title = `${progress}% - ${defaultLocaleCount - localeCount} field missing`;
    
    return (
        <li title={title}>
            <pre>{locale}</pre>
            <ProgressBar progress={progress}/>
        </li>
    )
}

const LocalesProgress: React.FC = ({ progress, defaultLocale }) => {
    const preferenceKey = 'localesProgressCollapsed';
    const { getPreference, setPreference } = usePreferences();
    const [ isCollapsed, setIsCollapsed ] = useState(false);
    const locales = Object.keys(progress);
    const totalStringsTranslated = locales.reduce((acc, locale) => {
        return locale !== defaultLocale ? acc += progress[locale] as number : acc;
    }, 0);
    const overallProgress = Math.round((totalStringsTranslated / (locales.length - 1)) / progress[defaultLocale] * 100);

    useEffect(() => {
        const syncCollapsedWithPreferences = async () => {
            const collapsedPreferences = await getPreference<string[]>(preferenceKey);
            setIsCollapsed(collapsedPreferences);
        };
        syncCollapsedWithPreferences();
    }, [getPreference, setIsCollapsed]);

    function toggleCollapsed(){
        const collapsedState = !isCollapsed;
        setIsCollapsed(collapsedState);
        setPreference(preferenceKey, collapsedState);
    }
    
    return (
        <div className={`locales-progress${isCollapsed ? '' : ' collapsed'}`}>
            <div className="overall" onClick={toggleCollapsed}>
                <ProgressBar progress={overallProgress} />
                <Chevron/>
            </div>
            <ul className="details">
                {locales.map(locale => locale !== defaultLocale ? (
                    <LocaleProgress 
                        key={locale} 
                        locale={locale}
                        localeCount={progress[locale]}
                        defaultLocaleCount={progress[defaultLocale]} />
                        ) : false )}
            </ul>
        </div>
    )
}

export default LocalesProgress;