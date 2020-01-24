import * as React from 'react';
import './style/Log.scss';

interface Props {
    value: string;
}

class Log extends React.Component<Props, any> { 

    constructor(props: Props){
        super(props);
    }

    render () {
        return (
            <div className='console-wrapper'>
                <textarea className='max dark' disabled value={this.props.value}>
                </textarea>
            </div>
        );
    }
}
export default Log;