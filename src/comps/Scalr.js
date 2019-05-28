import React, { Component } from 'react';
import Editor from './Editor';
import View from './View';
import '../css/design.css';
import '../css/flex.css';
import '../css/width.css';


class Scalr extends React.Component { 
    
    constructor(props){
        super(props);
        this.state = {};
    }

    render () {
        return (        
            <div className='flex outer outer-flex'>
                <div className='text-wrapper'>
                    <Editor />
                </div>
                <div className='view-wrapper'>
                    <View />
                </div>

            </div>
        );
    }
}
export default Scalr;