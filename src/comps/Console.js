import React, { Component } from 'react';
import '../css/Console.css';

class Console extends Component { 
    
    constructor(props){
        super(props);
        this.state = {};
    }

    render () {
        return (
            <div className='console-wrapper'>
                <textarea className='max dark' disabled>{text}</textarea>
            </div>
        );
    }
}
export default Editor;