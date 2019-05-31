import React, { Component } from 'react';
import '../css/Canvas.css';

class Canvas extends React.Component { 
    
    constructor(props){
        super(props);
        this.state = {};
    }

    render () {
        return (
                <div className= 'canvas shadow'>
                    <svg id='canvas'>

                    </svg>
                </div>
        );
    }
}
export default Canvas;