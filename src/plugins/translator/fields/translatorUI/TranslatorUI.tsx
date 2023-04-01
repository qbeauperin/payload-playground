import payload from "payload";
import { LocalizationConfig } from 'payload/dist/config/types';
import React, { useState, useEffect } from 'react';
import { useConfig, useLocale, useDocumentInfo } from "payload/components/utilities";
import { Modal, useModal } from '@faceless-ui/modal';
import { MinimalTemplate } from "payload/components/templates";
import { Button } from "payload/components/elements";
import { Label, useForm, useFormFields } from 'payload/components/forms';
import { Props } from 'payload/components/fields/Text';
import './styles.scss';
import LocalesProgress from "./components/LocalesProgress";
import { calculateDeadline } from "../../utilities/calculateDeadline";

const baseClass = 'translator';
const pastDeadlineMessage = "Based on the current published date, you probably won't get the translations back in time.";

const TranslatorUI: React.FC<Props> = (props) => {
    const { label, path } = props;
    const [ isLoading, setIsLoading ] = useState(false);
    const [ allLanguagesData, setAllLanguagesData ] = useState(null);
    const locale = useLocale();
    const { localization } = useConfig();
    const { locales, defaultLocale } = localization as LocalizationConfig;
    const defaultProgress = locales.reduce((acc, locale) => {
        acc[locale] = 0;
        return acc;
    }, {});
    const [ progress, setProgress ] = useState(defaultProgress);
    const [ totalStrings, setTotalStrings ] = useState(22);
    const [ totalWords, setTotalWords ] = useState(420);
    const { validateForm } = useForm();
    const { toggleModal } = useModal();
    const { id, collection, global, type } = useDocumentInfo();
    const modalSlug = `${baseClass}-confirmation-${id}`;
    const localesWithoutDefault = locales.filter((locale) => locale != defaultLocale ? locale : false);
    const publishedDateField = useFormFields(([fields, dispatch]) => fields.publishedDate);
    const publishedDate = new Date(publishedDateField?.value as string);
    const deadline = calculateDeadline(totalWords);
    const isDeadlineTooShort = deadline.getTime() > publishedDate.getTime();

    async function getFullDocData(){
        try {
            setIsLoading(true);
            await fetch(`http://localhost:3000/api/posts/${id}?locale=*&depth=0&draft=true`)
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
        if (!data || typeof data !== 'object') return false;

        const progress = Object.assign({}, defaultProgress);

        if (data[defaultLocale]){
            for (const key in data) {
                if(data[key] && data[key] !== '') progress[key]++;
            }
        }else{
            for (const key in data) {
                const childProgress = calculateProgress(data[key]);
                for(const childKey in childProgress){
                    progress[childKey] += childProgress[childKey];
                }
            }
        }
        return progress;
    }

    function handleGenerate(){
        console.log(deadline);
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
        getFullDocData();
    }, [])

    useEffect(() => {
        if (locales && allLanguagesData){
            setProgress(calculateProgress(allLanguagesData));
        }
    }, [locales, allLanguagesData]);

    return locale === defaultLocale ? (
        <div className={baseClass + (isLoading ? ' isLoading' : '')}>
            <Label label={label} />
            <Button
                size="small"
                buttonStyle="secondary"
                onClick={onRequestButtonClick}
            >
                Request translation
            </Button>
            <LocalesProgress {...{progress, defaultLocale}} />
            <Modal
                slug={modalSlug}
                className={`${baseClass}__modal`}
            >
                <MinimalTemplate className={`${baseClass}__template`}>
                    <h1>Request translation</h1>
                    <ul>
                        <li>
                            <span className="label">Quantity</span>
                            <div>{ `${totalStrings} strings, ${totalWords} words` }</div>
                        </li>
                        <li>
                            <span className="label">Languages</span>
                            <div>{localesWithoutDefault.map((locale) => <pre key={locale}>{locale}</pre> )}</div>
                        </li>
                        <li className={isDeadlineTooShort ? 'warning' : ''} title={isDeadlineTooShort ? pastDeadlineMessage : ''}>
                            <span className="label">Deadline</span>
                            <div>{deadline.toLocaleDateString('en', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}</div>
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
    ) : false;
};

export default TranslatorUI;