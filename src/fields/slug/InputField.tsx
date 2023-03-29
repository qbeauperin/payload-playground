import React, { useEffect, useState, useCallback, Fragment } from 'react'
import Slugify from 'slugify'
import { useAllFormFields, useField } from 'payload/components/forms';
import { Label } from 'payload/components/forms';
import { Button } from 'payload/components';
import TextInputField from 'payload/dist/admin/components/forms/field-types/Text/Input';
import { Props } from 'payload/components/fields/Text';
import './styles.scss';
import { lowerCase } from 'lodash';

const baseClass = 'slug-field';
const typingDelay = 500;

const InputField: React.FC<Props> = (props) => {
    const { path, label, name, required } = props;
    const { value = '', setValue } = useField({ path });

    const [ fields ] = useAllFormFields();
    const [ typedSlug, setTypedSlug ] = useState(value);

    useEffect(() => {
        const timeOutId = setTimeout(() => regenerateSlug(typedSlug), typingDelay);
        return () => clearTimeout(timeOutId);
    }, [typedSlug]);

    useEffect(() => {
        setTypedSlug(value);
    }, [value]);

    function regenerateSlug(src?: string){
        if(!src) src = fields?.title?.value as string;
        if(!src || src?.length <= 0) return false;

        setValue(Slugify(src, {
            lower: true,
            strict: true,
        }));
    }

    return (
        <div className={baseClass}>
            <Label
                htmlFor={path}
                label={label}
                required={required}
            />
            <div className={`${baseClass}__wrap`}>
                <TextInputField
                    path={name}
                    name={name}
                    onChange={(e) => setTypedSlug(e?.target?.value)}
                    value={typedSlug}
                    // showError={showError}
                />
                <Button
                    // size="small"
                    buttonStyle="secondary"
                    onClick={() => regenerateSlug()}
                >
                    Regenerate
                </Button>
            </div>
        </div>
    )
};
export default InputField;