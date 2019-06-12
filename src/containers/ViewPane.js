import React, { Component } from 'react';
import Canvas from './Canvas';
import '../css/View.css';

class View extends Component { 
    
    constructor(props){
        super(props);
        this.state = {};
    }

    render () {
        return (
            <div className='frame max inset-shadow'>
                <Canvas/>
            </div>

        );
    }
}
export default View;