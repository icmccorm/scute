import * as React from 'react';
import './css/Log.css';

interface Props {
    text: string;
}

class Log extends React.Component<Props, any> { 

    constructor(props: Props){
        super(props);
    }

    render () {
        return (
            <div className='console-wrapper'>
                <textarea className='max dark' disabled value={this.props.text}></textarea>
            </div>
        );
    }
}
export default Log;