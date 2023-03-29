import payload from "payload";
import React, { useState, useEffect } from 'react';
import { useConfig, useLocale, useDocumentInfo } from "payload/components/utilities";
import { Modal, useModal } from '@faceless-ui/modal';
import { MinimalTemplate } from "payload/components/templates";
import { Button } from "payload/components/elements";
import { useForm } from 'payload/components/forms';
import { Props } from 'payload/components/fields/Text';
import './styles.scss';

const baseClass = 'translator';

const TranslatorUI: React.FC<Props> = (props) => {
    const { label, path } = props;
    const [ isLoading, setIsLoading ] = useState(false);
    const [ allLanguagesData, setAllLanguagesData ] = useState(null);
    const locale = useLocale();
    const { localization } = useConfig();
    const { locales, defaultLocale } = localization;
    const { validateForm } = useForm();
    const { toggleModal } = useModal();
    const { id, collection, global, type } = useDocumentInfo();
    const modalSlug = `${baseClass}-confirmation-${id}`;
    const localesWithoutDefault = locales.filter((locale) => locale != defaultLocale ? locale : false);

    async function getFullDocData(){
        try {
            setIsLoading(true);
            await fetch(`http://localhost:3000/api/posts/${id}?locale=*&depth=0`)
                .then((response) => response.json())
                .then((doc) => {
                    setAllLanguagesData(doc);
                })
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    function calculateProgress(data){
        // console.log(locales);
        console.log(data);
    }

    function handleGenerate(){
        console.log('TRANSLATION REQUESTED');
    }

    function getLocalizedFields(array){
        const localizedFields = [];

        array.forEach((item) => {
            if(item.localized){
                localizedFields.push(item)
            }
        })

    }

    function onRequestButtonClick(){
        getFullDocData();
        
        validateForm().then((valid:Boolean) => {
            if(valid){
                toggleModal(modalSlug);
            } else {
                
            }
        });
    }

    useEffect(() => {
        calculateProgress(allLanguagesData);
    }, [allLanguagesData]);

    return (
        <div className={baseClass + (isLoading ? ' isLoading' : '')}>
            {/* <Label label={label} /> */}
            <Button
                size="small"
                buttonStyle="secondary"
                onClick={onRequestButtonClick}
            >
                Request translation
            </Button>
            <Modal
                slug={modalSlug}
                className={`${baseClass}__modal`}
            >
                <MinimalTemplate className={`${baseClass}__template`}>
                    <h1>Request translation</h1>
                    <ul>
                        <li>
                            <span className="label">Quantity</span>
                            <div>69 strings, 420 words</div>
                        </li>
                        <li>
                            <span className="label">Languages</span>
                            <div>{localesWithoutDefault.map((locale) => <pre key={locale}>{locale}</pre> )}</div>
                        </li>
                        <li>
                            <span className="label">Deadline</span>
                            <div>April 6, 2023 (Thursday)</div>
                        </li>
                    </ul>

                    <Button
                        buttonStyle="secondary"
                        type="button"
                        onClick={() => {
                            toggleModal(modalSlug);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleGenerate}
                    >
                        Request
                    </Button>
                </MinimalTemplate>
            </Modal>
        </div>
    )
};

export default TranslatorUI;