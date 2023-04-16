import React from 'react';
import { Modal, useModal } from '@faceless-ui/modal';
import { MinimalTemplate } from "payload/components/templates";
import { Button } from "payload/components/elements";
import './styles.scss';

interface Props{
    slug: string;
    title: string;
    confirmLabel?: string;
    onConfirm: Function;
    children?: React.ReactNode;
}

const Confirm: React.FC<Props> = ({ slug, title, confirmLabel = "Confirm", onConfirm, children }) => { // TODO handle i18n
    const baseClass = "confirmModal";
    const { toggleModal } = useModal();

    return (
        <Modal
            slug={slug}
            className={`${baseClass}__modal`}
        >
            <MinimalTemplate className={`${baseClass}__template`}>
                <h1>{title}</h1>
                { children }

                <Button
                    buttonStyle="secondary"
                    type="button"
                    onClick={() => {
                        toggleModal(slug);
                    }}
                >
                    Cancel {/* // TODO handle i18n */}
                </Button>
                <Button
                    onClick={onConfirm}
                >
                    {confirmLabel}
                </Button>
            </MinimalTemplate>
        </Modal>
    )
}

export default Confirm;