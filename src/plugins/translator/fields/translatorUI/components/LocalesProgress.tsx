import React from 'react';

const ProgressBar: React.FC = ({progress}) => {
    const colors = [
        {max: 50, color: 'red'},
        {max: 75, color: 'orangered'},
        {max: 99, color: 'orange'},
        {max: 100, color: 'green'}
    ];
    
    return (
        <div className='progress-bar'>
            <div className='progress-bar__progress' style={{ width: `${progress}%`, backgroundColor: colors.find(color => progress <= color.max)?.color } as React.CSSProperties}></div>
        </div>
    )
}

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

const LocalesProgress: React.FC = (props) => {
    return (
        <div className="locales-progress">
            <ul>
                {Object.keys(props?.progress).map(locale => locale !== props?.defaultLocale ? (
                    <LocaleProgress 
                        key={locale} 
                        locale={locale}
                        localeCount={props.progress[locale]}
                        defaultLocaleCount={props.progress[props?.defaultLocale]} />
                ) : false )}
            </ul>
        </div>
    )
}

export default LocalesProgress;