import React, { Component } from 'react';
import './css/Canvas.css';

class Canvas extends Component { 
    
    constructor(props){
        super(props);
        this.state = {};
    }

    render () {
        return (
                <div className= 'canvas shadow'>
                    <svg id='canvas'>
                        {this.props.display.svg}
                    </svg>
                    <style>
                        {this.props.display.css}
                    </style>
                </div>
        );
    }
}
export default Canvas;