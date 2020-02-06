import * as React from 'react';
import './style/Navbar.scss';

type Props = {children: any}

export const Navbar  = ({children}:Props) => {
    return (
        <div className='navbar'>
            <div className='nav'>
                {children}
            </div>
        </div>
    );
}

