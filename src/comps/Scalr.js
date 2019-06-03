import React, { Component } from 'react';
import Editor from './Editor';
import View from './View';
import Navbar from './Navbar';
import '../css/Scalr.css'

class Scalr extends Component { 
    
    constructor(props){
        super(props);
        this.state = {};
    }

    render () {
        return (     
            
            <div className= 'root'>
                <Navbar/>
                <div className='flex outer outer-flex'>
                    <div className='text-wrapper'>
                        <Editor />
                    </div>
                    <div className='view-wrapper darkgray-b'>
                        <View />
                    </div>
            </div>
            </div>
            
        );
    }
}
export default Scalr;