import * as React from 'react';
import './style/Log.scss';

type Props = {value: string}

export const Log = ({value}:Props) => { 
    return(
        <div className='console-wrapper'>
            <textarea className='max dark' disabled value={value}>
            </textarea>
        </div>
    );
}
