import React, { Component } from 'react';
import './css/Log.css';

class Log extends Component { 
    
    constructor(props){
        super(props);
        this.state = {};
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