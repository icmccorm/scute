import * as React from 'react';
import './style/Navbar.scss';

type Props = {children: any, className?: string}

export const Navbar  = ({children, className}:Props) => {
    return (
        <div className={className ? className + " navbar" : "navbar"}>
            <div className='nav'>
                {children}
            </div>
        </div>
    );
}

