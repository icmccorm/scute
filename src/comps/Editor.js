import React, { Component } from 'react';
import '../css/Editor.css';

class Editor extends React.Component { 
    
    constructor(props){
        super(props);
        this.state = {};
    }

    render () {
        return (
            <div className='flex inner-flex max'>
                <div className='code-wrapper'>
                    <textarea className='max dark'></textarea>
                </div>
                <div className='console-wrapper'>
                    <textarea className='max dark'></textarea>
                </div>
            </div>
        );
    }
}
export default Editor;