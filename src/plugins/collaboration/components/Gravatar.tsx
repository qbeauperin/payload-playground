import React from 'react';
import md5 from 'md5';
import qs from 'qs';

interface Props {
    email: string;
    size?: number;
}

const Gravatar: React.FC<Props> = ({ email, size = 25 }) => {
    const hash = md5(email.trim().toLowerCase());
    const query = qs.stringify({
        s: size*2,
        r: 'g',
        default: 'mp',
    });
    return (
        <img
            className="gravatar-account"
            style={{ borderRadius: '50%' }}
            src={`https://www.gravatar.com/avatar/${hash}?${query}`}
            alt="yas"
            width={size}
            height={size}
        />
    );
};

export default Gravatar;