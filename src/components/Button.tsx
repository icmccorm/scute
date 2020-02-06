import * as React from 'react';
import './style/Button.scss';

type Props = {onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void, children: string}

export const Button  = ({onClick, children}:Props) => {
    return (
        <button 
            className='button turq-b' 
            onClick={onClick}>
                {children}

        </button>
    );
}
