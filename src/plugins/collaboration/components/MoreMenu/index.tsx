import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'payload/components/elements';
import DragHandle from 'payload/dist/admin/components/icons/More';
import Edit from 'payload/dist/admin/components/icons/Edit';
import './styles.scss';
import Delete from '../icons/Delete';

interface MoreMenuItemProps {
    label: string;
    icon: string;
    onClick: Function;
    isDangerous?: boolean;
}
export const MoreMenuItem: React.FC<MoreMenuItemProps> = ({ label, icon, onClick, isDangerous = false }) => {
    const baseClass = "moreMenuItem";
    let iconComponent = null;
    switch(icon){
        case 'edit':
            iconComponent = <Edit/>;
            break;
        case 'delete':
            iconComponent = <Delete/>;
            break;
    }
    return (
        <button className={baseClass + (isDangerous ? ` ${baseClass}--dangerous` : '')} onClick={onClick}>
            <span className={`${baseClass}__label`}>{label}</span>
            {iconComponent &&
                <span className={`${baseClass}__icon`}>
                    {iconComponent}
                </span>
            }
        </button>
    )
}

interface MoreMenuProps {
    children: React.ReactNode;
}
const MoreMenu: React.FC<MoreMenuProps> = (props) => {
    const baseClass = "moreMenu";
    const [ isOpen, setIsOpen ] = useState(false);
    const component = useRef(null);

    useEffect(() => {
        // Listen to clicks on the whole document
        document.addEventListener('click', handleClicks, true);
        return () => {
            document.removeEventListener('click', handleClicks, true);
        };
    }, []);

    const handleClicks = (event) => {
        // If click is outside of the component
        if (component.current && !component.current.contains(event.target)) {
            setIsOpen(false);
        }
    }

    return (
        <div className={baseClass} ref={component}>
            <Button 
                buttonStyle="none"
                icon={(<DragHandle />)}
                size="small"
                className={`${baseClass}__button`}
                onClick={() => setIsOpen(!isOpen)}
            />
            <div className={`${baseClass}__menu` + (isOpen ? ` ${baseClass}__menu--open` : '')}>
                { props.children }
            </div>
        </div>
    )
}

export default MoreMenu;