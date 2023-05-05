import React from 'react';
import { progressColors } from '../../types';
import './styles.scss';

const ProgressBar: React.FC = ({progress, ...props}) => {
    return (
        <div className='progress-bar' {...props}>
            <div className='progress-bar__progress' style={{ width: `${progress}%`, backgroundColor: progressColors.find(color => progress <= color.max)?.color } as React.CSSProperties}></div>
        </div>
    )
}

export default ProgressBar;