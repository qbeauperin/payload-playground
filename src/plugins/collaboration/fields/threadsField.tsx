import React, { useState, useEffect } from 'react';
import { useDocumentInfo } from "payload/components/utilities";
import { PluginOptions } from '../types';
import { Label } from 'payload/components/forms';
import { Field } from 'payload/types';
import { UIField } from 'payload/dist/fields/config/types';
import Threads from '../components/Threads';

const threadsFieldComponent = (pluginOptions: PluginOptions): React.FC<UIField> => {
    return ({ label }) => {
        const [ currentUser, setCurrentUser ] = useState(null);
        const { id: docId } = useDocumentInfo();

        const getCurrentUser = () => {
            fetch(`http://localhost:3000/api/users/me/`)
                .then((response) => response.json())
                .then((data) => {
                    setCurrentUser(data?.user);
                });
        }

        useEffect(() => {
            getCurrentUser();
        }, []);

        return docId ? (
            <div className="collaboration">
                <Label label={label} />
                <Threads currentUser={currentUser} pluginOptions={pluginOptions} />
            </div>
        ) : false;
    };
}

const threadsField = (pluginOptions:PluginOptions): Field => {
    return {
        name: 'threads',
        label: 'Messages',
        type: 'ui',
        admin: {
            position: 'sidebar',
            components: {
                Field: threadsFieldComponent(pluginOptions)
            },
        },
    }
};

export default threadsField;