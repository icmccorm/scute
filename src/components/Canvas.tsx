import * as React from 'react';
import './css/Canvas.css';

class Canvas extends React.Component<any, any> {
    display: {
        svg: string,
        css: string
    };

    constructor(props: object){
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