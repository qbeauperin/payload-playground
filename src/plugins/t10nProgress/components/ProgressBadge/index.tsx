import React from 'react';
import { progressColors } from '../../types';
import './styles.scss';

const ProgressBadge: React.FC = ({locale, progress, ...props}) => {
    return (
        <pre className='progress-badge' {...props} style={{ backgroundColor: progressColors.find(color => progress <= color.max)?.color } as React.CSSProperties}>
            {locale}
        </pre>
    )
}

export default ProgressBadge;