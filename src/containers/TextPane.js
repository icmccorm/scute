import React, { Component } from 'react';
import '../css/TextPane.css';
import Console from '../comps/Console';

class TextPane extends Component { 
    
    constructor(props){
        super(props);
        this.state = {};
    }

    render () {
        return (
            <div className='flex inner-flex max'>
                <Editor/>
                <Console/>
            </div>
        );
    }
}
export default Editor;