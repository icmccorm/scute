import * as React from 'react';
import './style/Button.scss';

type Props = {onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void, disabled?: boolean, children: string};

export const Button  = ({onClick, disabled, children}:Props) => {

    return (
        <button 
            disabled={disabled}
            className='button turq-b' 
            onClick={onClick}>
                {children}
        </button>
    );
}
